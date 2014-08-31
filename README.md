# Catnap
[![NPM version](https://badge.fury.io/js/catnap.svg)](http://badge.fury.io/js/catnap) [![Build Status](https://travis-ci.org/mikaa123/catnap.svg?branch=master)](https://travis-ci.org/mikaa123/catnap) [![Coverage Status](https://img.shields.io/coveralls/mikaa123/catnap.svg)](https://coveralls.io/r/mikaa123/catnap?branch=master)

<img width="300" align="right" src="https://dl.dropboxusercontent.com/u/25944784/cnp2.png"/>

> A short nap, which allows for a quick boost in energy.

Fast and simple Resource-Oriented Architecture for Node.

Catnap allows you to create elegant REST APIs by describing **REST Resources**. It takes care of creating and serving these resources for you.

## Installing
`$ npm install catnap`

## Getting Started
Catnap lets you describe **Resources** identified by a name and a path. A Resource can have one or many **representations** and responds to **actions** (get, post, put, patch an delete.) Here is a contrived example:

~~~~javascript
var cnp = require('catnap');

cnp.resource('user', '/users/:userId')
    .representation(function (user) {
        // The default representation. Returns a full representation of user
        return user;
    })
    .representation('partial', function (user) {
    	// A named representation that returns a partial representation
    	return pick(user, 'username', 'email');
    })
    .get(function (req, res) {
    	// Action methods take standard connect-middlewares.
        User.findOne({ _id: req.params.userId }, function (err, user) {
            user && res.send(200, cnp('user')(user));
        });
    })
~~~~

The representations map **internal entities** (such as the ones in your database) into media types.
To get the representations of the `user` resource:

~~~~javascript
cnp('user', user); // => Calls the default representation
userResource(user, 'partial', user); // => Calls the partial representation
~~~~

* To get started, check out the [Getting Started Guide](http://github.com/mikaa123/catnap/wiki/Getting-Started)
* For a concrete example, have a look at [Implementing a simple API](https://gist.github.com/mikaa123/a9380af5cd1d56a387ce)


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
