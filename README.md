# Catnap

<img width="300" align="right" src="https://dl.dropboxusercontent.com/u/25944784/catnap.png"/>

> a catnap helps you get Express REST.

Catnap is a minimal approach to **handle REST Resources** on Express-like routers. It simplifies creating named resources and **defining their representations** while keeping your code DRY.

Catnap doesn't get in your way by imposing an architecture. It can be dropped as-is on existing Express projects.

## Installing

## How to use
Catnap lets you create **Resources**, identified by a name and a path. They expose verbs methods (get, post, patch, put and delete) that take middleware, and let you define representations.

~~~~javascript
var express = require('express'),
    app = express(), // Standard Express stuff.
    makeResource = require('catnap').makeResource;

// Let's create a Resource 'users', located at '/users'.
usersResource = makeResource('users', '/users');

usersResource
    .get(function (req, res) {
        // Answers with the list of users
    })

    .post(function (req, res) {
        // Lets us create a user and returns its representation
    });
        
// Now that the resource is defined, we can attach it to `app`.
usersResource.attachTo(app);
    
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
~~~~

A Resource has one or many **representations**. They are typically returned when we _GET_ them. Let's define a representation for our `usersResource` using the hal+json media type.

~~~~javascript
usersResource

    // Here we define the default representation for the `usersResource`.
    .representation(function (users) {
        return {
            count: users.length,
            _embedded: {
                users: users
            }
        };
    });
~~~~

A representation takes an **entity** which is usually what is stored in your database. In order to use a representation,
call the Resource function, `usersResource` in our case with the desired entity:

~~~~javascript
usersResource
    .get(function (req, res) {
        User.find({}, function (err, users) {
			res.send(200, usersResource(users));
		});
    })
~~~~

## Contributing

## License
