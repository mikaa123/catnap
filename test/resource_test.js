var assert = require('assert'),
	should = require('should'),
	sinon = require('sinon'),
	resource = require('../').resource;

var verbs = ['get', 'post', 'put', 'patch', 'delete'];

describe('Resource', function () {
	describe('Creation', function () {
		it('should create a resource when a correct name and path are given', function () {
			var testResource;

			assert.doesNotThrow(function () {
				testResource = resource('/test');
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

			testResource.representation(function () {
				return 'default';
			});

			testResource(defaultEntity).should.eql('default');

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
