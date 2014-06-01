# Catnap

<img width="300" align="right" src="https://dl.dropboxusercontent.com/u/25944784/catnap.png"/>

> a catnap helps you get Express REST.

Catnap is a minimal approach to **handle REST Resources** on Express-like routers. It simplifies creating named resources and **defining their representations** while keeping your code DRY.

Catnap doesn't get in your way by imposing an architecture. It can be dropped as-is on existing Express projects.

## Installing

## Getting Started
Catnap lets you create **Resources** identified by a name and a path. A Resource can have one or many **representations** and respond to **actions** (get, post, put, patch an delete.) Here is a contrived example.

~~~~javascript
var makeResource = require('catnap').makeResource;

var userResource = makeResource('user', '/users/:userId')
    .representation(function (user) {
        // The default representation. Returns a full representation of user
    })
    .representation('partial', function (user) {
    	// This is a named representation. Let's return a partial representation
    })
    .get(function (req, res) {
    	// Action methods take standard middleware.
        User.findOne({ _id: req.params.userId }, function (err, user) {
            user && res.send(200, userResource(user));
        });
    });
~~~~

## Example
~~~~javascript
var express = require('express'),
	app = express(), // Standard Express stuff.
	makeResource = require('catnap').makeResource;


/**
 * User Resource - /users/:userId
 * Supported action: GET
 * media type: hal+json
 */
var userResource = makeResource('user', '/users/:userId')

	.representation(function(user) {
		return extend(pick(user, 'username', 'createdAt', 'updatedAt'), {
			_links: {
				self: {
					href: this.path.replace(':userId', user.id)
				}
			}
		});
	})

	.representation('partial', function(user) {
		return {
			name: user.name,
			age: user.age
		};
	})

	.get(function(req, res) {
		User.findOne({ _id: req.params.userId }, function (err, user) {
			user && res.send(200, userResource(user));
		});
	})

	.attachTo(app);


/**
 * Users Resource - /users
 * Supported action: GET, POST
 * media type: hal+json
 */
var usersResource = makeResource('users', '/users')

	.representation(function (users) {
		var _users = users.map(function (user) {
			return userResource(user, 'partial');
		});

		return {
			count: users.length,
			_embedded: {
				users: _users
			}
		};
	})

	.get(function (req, res) {
		User.find({}, function (err, users) {
			res.answer(usersResource(users));
		});
	})

	.post(function (req, res, next) {
		// Some checking here.
		user = new User(reqBody);
		user.save(function (err, newUser) {

			if (err) {
				// Handle error.
			}

			res.send(201, userResource(newUser));
		});

	})

	.attachTo(app);


var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});
~~~~

## Contributing

## License
