// A repository for resources.

var util = require('./utils'),
	variadic = util.variadic,
	fluent = util.fluent,
	maybe = util.maybe,
	extend = util.extend,
	compose = util.compose;

var makeGroup = module.exports = function () {
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

	return _group;
};
