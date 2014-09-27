require('should');

var assert = require('assert'),
	facade = require('../lib/facade');

describe('Catnap Facade', function () {
	var cnp,
		router = {};

	beforeEach(function () {
		cnp = facade(router);
	});

	it('should allow creating resources', function () {
		cnp.resource('foo', '/foo').representation.should.be.ok;
	});

	it('should retrieve defined resources', function () {
		cnp.resource('foo', '/foo');
		cnp('foo').representation.should.be.ok;
	});

	it('should throw when the resource isnt registered', function () {
		assert.throws(function () {
			cnp('bar');
		});
	});

	it('should facilitate resource serialization', function () {
		var myEntity = {
			foo: 'bar'
		};

		cnp.resource('foo', '/foo')
			.representation(function (e) { return e; })
			.representation('simple', function (e) { return 'simple'; });

		cnp('foo', myEntity).should.equal(myEntity);
		cnp('foo', 'simple', myEntity).should.equal('simple');
	});

	it('should throw if the serialization doesnt exist', function () {
		cnp.resource('foo', '/foo');

		assert.throws(function () {
			cnp('foo', 'partial', {});
		});
	});

});
