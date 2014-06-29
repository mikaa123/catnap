// # Group
//
// Groups related resources together; and lets you retrieve them.
//
// ## Create a group
//
// * group - Constructs a new group.
//
// ## Group methods
//
// * put - Associates a name to the resource
// * resource - Creates a new resource (helper)
// * myGroup('resource-name') - Retrieves the resource
//

var util = require('./utils'),
	resource = require('./resource'),
	fluent = util.fluent,
	maybe = util.maybe;

module.exports = function group() {
	var _resources = {};

	var _group = function (r) {
		var res = _resources[r];

		if (!res) throw new Error('Resource ' + r + ' not found.');
		return res;
	};

	_group.put = fluent(maybe(function (name, resource) {
		_resources[name] = resource;
	}));

	_group.resource = function (name, path) {
		return (_resources[name] = resource(name, path));
	};

	return _group;
};
