/**
 * # Group
 *
 * Groups let you organize resources. They act as a registery, allowing you to
 * add or get resources.
 *
 * ## Create a group
 *   group - Constructs a new group.
 *
 * ## Group methods
 *   myGroup('resource-name')             - Get a resource
 *   myGroup('resource-name', myResource) - Add a resource
 *   resource('resource-name', '/path')   - Create a new resource
 */

var resource = require('./resource');

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
