var assert = require('assert'),
	should = require('should'),
	sinon = require('sinon'),
	makeGroup = require('../').makeGroup,
	makeResource = require('../').makeResource;

describe('Group', function () {
	describe('Create a group', function () {
		it('Should create a new group', function () {
			makeGroup().should.be.ok;
		});
	});

	describe('Adding resources', function () {
		var group;

		beforeEach(function () {
			group = makeGroup();
		});

		it('Should allow adding one or many resources', function () {
			var one = makeResource('one', '/one'),
				two = makeResource('two', '/two'),
				three = makeResource('three', '/three');

			group.add(one);
			group.add(two, three);

			group('one').should.eql(one);
			group('two').should.eql(two);
			group('three').should.eql(three);
		});

		it("Should throw if the Resource isn't available", function () {
			[undefined, null, 'coffee'].forEach(function (v) {
				assert.throws(function () {
					group(v);
				});
			});
		});

		it('Should allow to conveniently create a resource', function () {
			var newResource = group.makeResource('test', '/test');

			// Makes sure the created Resource is a resource
			newResource.should.be.a.Function;
			['attachTo', 'representation'].forEach(function(m) {
				newResource[m].should.be.ok;
			});

			group('test').should.eql(newResource);
		});
	});
});
