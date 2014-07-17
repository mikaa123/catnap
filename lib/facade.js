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
		api.put(name, res);
		return res;
	};

	return cnp;
};
