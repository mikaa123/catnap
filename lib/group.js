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
// * myGroup('resource-name') - Retrieves the resource
// * myGroup('resource-name', myResource) - Associates a resource to a name.
// * resource - Creates a new resource (helper)
//

var util = require('./utils'),
	resource = require('./resource'),
	fluent = util.fluent,
	maybe = util.maybe;

module.exports = function group() {
	var _resources = {};

	var _group = function (name, resource) {
		var res;

		if (resource != null)	_resources[name] = resource;

		res = _resources[name];
		if (!res) throw new Error('Resource ' + name + ' not found.');
		return res;
	};

	_group.resource = function (name, path) {
		return (_resources[name] = resource(name, path));
	};

	return _group;
};
