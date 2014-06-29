var assert = require('assert'),
	should = require('should'),
	sinon = require('sinon'),
	group = require('../').group,
	resource = require('../').resource;

describe('Group', function () {
	describe('Create a group', function () {
		it('Should create a new group', function () {
			group().should.be.ok;
		});
	});

	describe('Adding resources', function () {
		var myGroup;

		beforeEach(function () {
			myGroup = group();
		});

		it('Should allow adding one or many resources', function () {
			var one = resource('one', '/one'),
				two = resource('two', '/two'),
				three = resource('three', '/three');

			myGroup.add(one);
			myGroup.add(two, three);

			myGroup('one').should.eql(one);
			myGroup('two').should.eql(two);
			myGroup('three').should.eql(three);
		});

		it("Should throw if the Resource isn't available", function () {
			[undefined, null, 'coffee'].forEach(function (v) {
				assert.throws(function () {
					myGroup(v);
				});
			});
		});

		it('Should allow to conveniently create a resource', function () {
			var newResource = myGroup.resource('test', '/test');

			// Makes sure the created Resource is a resource
			newResource.should.be.a.Function;
			['attachTo', 'representation'].forEach(function(m) {
				newResource[m].should.be.ok;
			});

			myGroup('test').should.eql(newResource);
		});
	});
});
