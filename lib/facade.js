var resource = require('./resource');

module.exports = function (server) {
	return {
		resource: function resource(path) {
			return resource(path, server);
		}
	};
};
