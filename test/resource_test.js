var assert = require('assert'),
	should = require('should'),
	sinon = require('sinon'),
	makeResource = require('../').makeResource;

var verbs = ['get', 'post', 'put', 'patch', 'delete'];

describe('Resource', function () {
	describe('Creation', function () {
		it('should create a resource when a correct name and path are given', function () {
			var testResource;

			assert.doesNotThrow(function () {
				testResource = makeResource('test', '/test');
			});

			testResource._name.should.eql('test');
			testResource.path.should.eql('/test');
		});

		it('should throw an exception if the name is undefined', function () {
			var testResource;

			assert.throws(function () {
				testResource = makeResource(undefined, '/test');
			});
		});

		it('should throw an exception if the path is undefined', function () {
			var testResource;

			assert.throws(function () {
				testResource = makeResource('test');
			});
		});
	});

	describe('Registering actions', function () {
		var testResource;

		beforeEach(function () {
			testResource = makeResource('test', '/test');
		});

		verbs.forEach(function (action) {
			it('should allow ' + action, function () {
				testResource[action](function (req, res) {
					return 'foo';
				});

				testResource.actions[action][0]()
				.should.eql('foo');
			});
		});

		it('should allow multiple middlewares per actions', function () {
			testResource.get(function () {}, function () {});
			testResource.actions.get.length.should.eql(2);
		});
	});

	describe('Registering representations', function() {
		var testResource;

		beforeEach(function () {
			testResource = makeResource('test', '/test');
		});

		it('should allow default representation', function () {
			testResource.representation(function (e) {
				return 'bar';
			});

			testResource({}).should.eql('bar');
		});

		it('should allow adding named representations', function () {
			var defaultEntity = {
				a: 1
			};

			// Object syntax
			testResource.representation({
				'foo': function (e) {
					return 'foo';
				},

				'bar': function (e) {
					return 'bar';
				}
			});

			// Returns the default entity when no formatter exists
			testResource(defaultEntity).should.eql(defaultEntity);
			testResource(defaultEntity, 'foo').should.eql('foo');
			testResource(defaultEntity, 'bar').should.eql('bar');

			testResource.representation('isolated', function () {
				return 'isolated';
			});

			testResource(defaultEntity, 'isolated').should.eql('isolated');

			// Alternate syntax
			testResource.representation('partial', function () {
				return 'partial';
			});

			testResource(defaultEntity, 'partial').should.eql('partial');

			assert.throws(function () {
				testResource.representation('err', {});
			});
		});
	});

	describe('Attaching to routers', function () {
		it('should throw if the router does not have the required interface',
		function () {
			var testResource = makeResource('test', '/test'),
				router = {};

			verbs.forEach(function (v) {
				router[v] = sinon.spy();

				// Add a middleware on each route
				testResource[v](function () {});
			});

			testResource.attachTo(router);
			verbs.forEach(function (v) {
				router[v].called.should.be.true;
			});
		});
	});
});
