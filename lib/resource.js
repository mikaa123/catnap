/**
 * # Resource
 *
 * This module exposes a Resource factory function, allowing you to create **resources**.
 *
 * A REST Resource is identified by a name and a path. The path is relative to the
 * **router** where the resource is going to be `attachedTo`.
 *
 * The router is an Express-compatible router. It has to have get, post, patch, put
 * and delete methods. Any router that exposes this interface should be able use the
 * resource.
 *
 * Resources expose verbs methods (get, post, patch, put and delete) that take middleware
 * functions. The middlewares should comply to the router they will be attached to.
 *
 * Example with Express:
 *
 *    var usersResource = makeResource('users', /users');
 *
 *    usersResource
 *        .post(function (req, res) {
 *            // do something meaningful here.
 *        })
 *        .attachTo(anExpressRouter);
 *
 * ## Representations
 *
 * A Resource can have different representations, depending on the media types it
 * responds to. By calling the `representation` method and passing it a function,
 * it's possible to register a default representation.
 *
 *     userResource
 *         .representation(function (entity) {
 *             return {
 *                 name: entity.name
 *             };
 *         });
 *
 * The entity passed is usually the internal representation of the resource (the
 * one stored in your database.)
 *
 * It is also possible to resgister several representations.
 *
 *     userResource
 *         .representation({
 *             'full': function (entity) {
 *                 return entity;
 *             },
 *
 *             'partial': function (entity) {
 *                 return {
 *                     name: entity.name
 *                 };
 *             }
 *         })
 *
 * In order to obtain the resource's representation, just call the resource with
 * the entity to serialize. Using our above `userResource`, we could simply do:
 *
 *     var entity = {
 *       name: 'foo',
 *       lastName: 'bar'
 *     };
 *
 *     userResource(entity);
 *
 * To get a different representation, pass it the name.
 *
 *     userResource(entity, 'partial');
 *
 */

var util = require('./utils'),
	variadic = util.variadic,
	fluent = util.fluent,
	maybe = util.maybe,
	extend = util.extend;

function isFunction(f) {
	return typeof f === 'function';
}

/**
 * Factory function to create Resource objects
 * @param  {String} relPath The relative path of the resource.
 * @return {Resource}
 */
function makeResource(_name, relPath) {
	var	_representations = {};

	if (!_name || !relPath) {
		throw 'A Resource requires a name and a path.';
	}

	var newResource = function (entity, model) {
		var resource = _representations[model || 'default'];
		return resource && resource(entity) || entity;
	};

	['get', 'post', 'put', 'patch', 'delete'].forEach(function (action) {
		newResource[action] = fluent(variadic(function (middleware) {
			this.actions[action] = middleware;
		}));
	});

	newResource.attachTo = fluent(maybe(function (router) {
		for (var verb in this.actions) {
			router[verb].apply(router, [relPath].concat(this.actions[verb]));
		}
		return this;
	}));

	newResource.representation = fluent(maybe(function (representations) {
		function setRepresentation(key, fn) {
			_representations[key] = fn.bind(newResource);
		}

		// Sets the default representation
		if (isFunction(representations)) {
			setRepresentation('default', representations);
			return;
		}

		// Adds a named representation
		if (typeof representations === 'string') {
			if (!isFunction(arguments[1])) {
				throw 'A function is needed for the ' + representations + 'representation.';
			}

			setRepresentation(representations, arguments[1]);
			return;
		}

		// Handles an object of representations
		Object.keys(representations).forEach(function (name) {
			if (!isFunction(representations[name])) return;
			setRepresentation(name, representations[name]);
		});
	}));

	return extend(newResource, {
		path: relPath,
		actions: {},
		_name: _name
	});
}

module.exports = makeResource;
