var express = require('express'),
	app = express();

app.listen(3000, function () {
	console.log('Server running on port', 3000);
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
