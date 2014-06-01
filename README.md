# Catnap

<img width="300" align="right" src="https://dl.dropboxusercontent.com/u/25944784/catnap.png"/>

> a catnap helps you get Express REST.

Catnap is a minimal approach to **handle REST Resources** on Express-like routers. It simplifies creating named resources and **defining their representations** while keeping your code DRY.

Catnap doesn't get in your way by imposing an architecture. It can be dropped as-is on existing Express projects.

## Installing

## How to use
Catnap lets you create **Resources**, identified by a name and a path. They expose verbs methods (get, post, patch, put and delete) that take middleware.

~~~~javascript
var makeResource = require('catnap').makeResource,
    usersResource = makeResource('users', /users');

    usersResource
        .post(function (req, res) {
            // Do something meaningful here.
        })
        .get(function (req, res) {
            // Do something here.
        });

~~~~

## Contributing

## License
