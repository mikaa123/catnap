require('should');
var	facade = require('../lib/facade');

describe('Catnap Facade', function () {
	var cnp,
		router = {};

	beforeEach(function () {
		cnp = facade(router);
	});

	it('Should allow creating resources', function () {
		cnp.resource('foo', '/foo').representation.should.be.ok;
	});

	it('Should retrieve defined resources', function () {
		cnp.resource('foo', '/foo');
		cnp('foo').representation.should.be.ok;
	});

});
