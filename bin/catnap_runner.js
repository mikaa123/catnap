var express = require('express'),
	bodyParser = require('body-parser'),
	port = process.argv[2] || 3000,
	router = express.Router(),
	cwd = process.cwd(),
	app = express(),
	readdirp,
	stream;

app
	.use(bodyParser.json())
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

// Load index.js if the file exists before loading any resource
try {
	require(cwd);
} catch(e) { }

// Walk each folders to find *-resource.js files
readdirp = require('readdirp');

stream = readdirp({ root: cwd, fileFilter: '*-resource.js' })
	.on('readable', function () {
		require(stream.read().fullPath);
	});
