# Catnap
[![NPM version](https://badge.fury.io/js/catnap.svg)](http://badge.fury.io/js/catnap) [![Build Status](https://travis-ci.org/mikaa123/catnap.svg?branch=master)](https://travis-ci.org/mikaa123/catnap)

<img width="300" align="right" src="https://dl.dropboxusercontent.com/u/25944784/catnap.png"/>

> A short nap, which allows for a quick boost in energy.

Catnap is a minimal approach to **handle REST Resources** on Express-like routers. It simplifies creating named resources and **defining their representations** while keeping your code DRY.

Catnap doesn't get in your way by imposing an architecture. It can be dropped as-is on existing Express projects.

## Installing
`$ npm install catnap`

## Getting Started
Catnap lets you create **Resources** identified by a name and a path. A Resource can have one or many **representations** and respond to **actions** (get, post, put, patch an delete.) Here is a contrived example:

~~~~javascript
var makeResource = require('catnap').makeResource;

var userResource = makeResource('user', '/users/:userId')
    .representation(function (user) {
        // The default representation. Returns a full representation of user
        return user;
    })
    .representation('partial', function (user) {
    	// This is a named representation that returns a partial representation
    	return pick(user, 'username', 'email');
    })
    .get(function (req, res) {
    	// Action methods take standard middleware.
        User.findOne({ _id: req.params.userId }, function (err, user) {
            user && res.send(200, userResource(user));
        });
    });
~~~~

* To get started, check out the [Getting Started Guide](http://github.com/mikaa123/catnap/wiki/Getting-Started)
* For a concrete example, have a look at [Implementing a simple API](https://gist.github.com/mikaa123/a9380af5cd1d56a387ce)


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
