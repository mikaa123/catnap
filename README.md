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

* For more, check out the [[Getting Started Guide]]
* For an example, check the [Example application](Example-application)
