var	should = require('should'),
	utils = require('../lib/utils');

describe('Utils', function () {
	it('should extend', function () {
		var a = {};

		var c = utils.extend(a, {
			b: 1
		});

		a.b.should.eql(1);
		c.should.eql(a);
	});

	it('should handle fluent', function () {
		var obj = {};
		obj.foo = utils.fluent(function () {});
		obj.foo().should.eql(obj);
	});

	it('should know maybe', function () {
		var m = utils.maybe(function (a) {
			return true;
		});

		(m() == null).should.be.true;
		(m(1) == null).should.be.false;
	});

	it('should know compose', function () {
		var addOne = function (n) { return n + 1; },
			multiplyByTwo = function (n) { return n * 2; },
			composed = utils.compose(addOne, multiplyByTwo);
		composed(2).should.eql(5);
	});

	it('should know variadic', function () {
		var unary = utils.variadic(function(arr) {
			arr.should.be.an.instanceOf(Array);
		});

		var binary = utils.variadic(function(a, arr) {
			arr.should.be.an.instanceOf(Array);
		});

		unary(1);
		binary(1, 2);
		binary(1, 2, 3);
	});
});
