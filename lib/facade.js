var _resource = require('./resource');

module.exports = function (server) {
	return {
		resource: function resource(path) {
			return _resource(path, server);
		}
	};
};
