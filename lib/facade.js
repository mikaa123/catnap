/**
 * A Facade to Catnap for the CLI.
 * Provides an object to be used as a global, that behaves like a Group.
 *
 * Usage:
 * cnp.resource('foo', path) - Create a resource called foo.
 * cnp('name') - Retrieves the resource called foo
 */

var _resource = require('./resource'),
	api = require('./group')();

module.exports = function (server) {
	var cnp = function (resource) {
		return api(resource);
	};

	cnp.resource = function resource(name, path) {
		if (!name || !path) {
			throw new Error('A Resource requires a name and a path.');
		}

		var res = _resource(path, server);
		api(name, res);
		return res;
	};

	return cnp;
};
