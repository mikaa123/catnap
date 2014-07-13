var express = require('express'),
	app = express(),
	port = process.argv[2] || 3000,
	router = express.Router();

app
	.use(router)
	.use(function(req, res, next) {
		res.send(404, 'Sorry cant find that!');
	})
	.listen(port, function () {
		console.log('Server running on port', port);
	})
		.on('error', function () {
			console.log('Port %s already used.', port);
		});

// Catnap's facade
GLOBAL.catnap = require('../lib/facade')(router);

// Walk each folders to find *-resource.js files
var readdirp = require('readdirp');

var stream = readdirp({ root: process.cwd(), fileFilter: '*-resource.js' })
	.on('readable', function () {
		require(stream.read().fullPath);
	});
