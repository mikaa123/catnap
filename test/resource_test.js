var assert = require('assert'),
	should = require('should'),
	sinon = require('sinon'),
	resource = require('../').resource;

var verbs = ['get', 'post', 'put', 'patch', 'delete'];

describe('Resource', function () {
	describe('Creation', function () {
		it('should create a resource when a correct path is given', function () {
			var testResource;

			assert.doesNotThrow(function () {
				testResource = resource('/test');
			});

			testResource.path().should.eql('/test');
		});

		it('should create a resource if a path and a router is provided', function () {
			var myRouter = {};
			var testResource;

			assert.doesNotThrow(function () {
				testResource = resource('/test', myRouter);
			});

			testResource.path().should.eql('/test');
		});

		it('should throw an exception if the path is undefined', function () {
			var testResource;

			assert.throws(function () {
				testResource = resource(undefined);
			});
		});
	});

	describe('Registering actions', function () {
		var testResource;

		beforeEach(function () {
			testResource = resource('/test');
		});

		verbs.forEach(function (action) {
			it('should allow ' + action, function () {
				var myTestingMiddleware = function (req, res) {};
				testResource[action](myTestingMiddleware);

				testResource.actions[action][0]
				.should.eql(myTestingMiddleware);
			});
		});

		it('should allow multiple middlewares per actions', function () {
			testResource.get(function () {}, function () {});
			testResource.actions.get.length.should.eql(2);
		});

		it('should register actions on the router if it has been provided', function () {
			var router = {},
				testResource = resource('/test', router);

			verbs.forEach(function (v) {
				router[v] = sinon.spy();
				testResource[v](function () {}, function () {});
				router[v].called.should.be.true;
			});
		});
	});

	describe('Registering representations', function() {
		var testResource;

		beforeEach(function () {
			testResource = resource('/test');
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

			testResource.representation(function (entity) {
				return 'default ' + entity.a;
			});

			testResource(defaultEntity).should.eql('default 1');

			testResource.representation('partial', function (entity) {
				return 'partial ' + entity.a;
			});

			testResource('partial', defaultEntity).should.eql('partial 1');

			assert.throws(function () {
				testResource.representation('err', {});
			});
		});

		it('should throw if the representation doesnt exist', function () {
			assert.throws(function () {
				testResource('unknown-representation', {});
			});
		});
	});

	describe('Attaching to routers', function () {
		it('should throw if the router does not have the required interface',
		function () {
			var testResource = resource('/test'),
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

	describe('Constructing a Resource path', function () {
		var testResource;

		beforeEach(function () {
			testResource = resource('/issues/:issueId/talks/:talkId');
		});

		it('should return the complete path if no argument, or an empty object is passed', function () {
			testResource.path().should.eql('/issues/:issueId/talks/:talkId');
			testResource.path({}).should.eql('/issues/:issueId/talks/:talkId');
		});

		it('should throw an exception if the passed argument is not an object', function () {
			assert.throws(function () {
				testResource.path("test");
			});

			assert.throws(function () {
				testResource.path(null);
			});
		});

		it('should return the constructed path', function () {
			testResource.path({
				'issueId': "a",
				'talkId': "b"
			}).should.eql('/issues/a/talks/b');

			testResource.path({
				':issueId': "a",
				':talkId': "b"
			}).should.eql('/issues/a/talks/b');

			testResource.path({
				issueId: "a",
				talkId: "b"
			}).should.eql('/issues/a/talks/b');

			testResource.path({
				'issueId': "foo",
			}).should.eql('/issues/foo/talks/:talkId');
		});
	});
});
