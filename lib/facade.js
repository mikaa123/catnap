/**
 * A Facade to Catnap for the CLI.
 * Provides an object to be used as a global, that behaves like a Group.
 *
 * Usage:
 * cnp.resource('foo', path) - Create a resource called foo.
 * cnp('name') - Retrieves the resource called foo
 * cnp('name', entity) - Serializes `entity` using the default serialization
 * cnp('name', 'partial', entity) - Serializes `entity` using a named serialization
 */

var _resource = require('./resource'),
	group = require('./group')();

module.exports = function (server) {
	var cnp = function (resource, serialization, entity) {
		var res = group(resource);

		if (!serialization) {
			return res;
		}

		if (!entity) {
			entity = serialization;
			serialization = 'default';
		}

		return res(serialization, entity);
	};

	cnp.resource = function resource(name, path) {
		if (!name || !path) {
			throw new Error('A Resource requires a name and a path.');
		}

		var res = _resource(path, server);
		group(name, res);
		return res;
	};

	return cnp;
};
