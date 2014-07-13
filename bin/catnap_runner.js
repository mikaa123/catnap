var express = require('express'),
	app = express(),
	port = process.argv[2] || 3000;

app.listen(port, function () {
	console.log('Server running on port', port);
})
	.on('error', function () {
		console.log('Port %s already used.', port);
	});

// Catnap's facade
GLOBAL.catnap = require('../lib/facade')(app);

// Walk each folders to find *-resource.js files
var readdirp = require('readdirp');

var stream = readdirp({ root: process.cwd(), fileFilter: '*-resource.js' })
	.on('readable', function () {
		require(stream.read().fullPath);
	})
	.on('end', function () {
		app.use(function(req, res, next) {
			res.send(404, 'Sorry cant find that!');
		});

	});
