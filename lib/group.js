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
// * add - Adds resources to the group
// * resource - Creates a new resource (helper)
// * myGroup('resource-name') - Retrieves the resource
//

var util = require('./utils'),
	resource = require('./resource'),
	variadic = util.variadic,
	fluent = util.fluent,
	maybe = util.maybe;

var group = module.exports = function () {
	var _resources = {};

	var _group = function (r) {
		var res = _resources[r];

		if (!res) throw new Error('Resource ' + r + ' not found.');
		return res;
	};

	// Adds one or many resources to the group
	_group.add = fluent(maybe(variadic(function (resources) {
		resources.forEach(function (r) {
			if (!r._name) {
				throw new Error("Can't add Resource: " + r);
			}

			_resources[r._name] = r;
		});
	})));

	_group.resource = function (name, path) {
		return (_resources[name] = resource(name, path));
	};

	return _group;
};
