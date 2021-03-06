/**
 * # Resource
 *
 * This module exposes a Resource factory function, allowing you to create **resources**.
 *
 * A REST Resource is identified by a path. The path is relative to the
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
 *    var usersResource = resource('/users');
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
	extend = util.extend,
	compose = util.compose;

function isFunction(f) {
	return typeof f === 'function';
}

var setter = compose(fluent, maybe);

/**
 * Factory function to create Resource objects
 * @param  {string} _path The relative path of the resource.
 * @param  {Router} [_router] A router where all the routes are going to be attached.
 * @return {Resource}
 */
module.exports = function resource(_path, _router) {
	var	_representations = {};

	if (!_path) {
		throw new Error('A Resource requires a path.');
	}

	var newResource = function serializeResource(representationName, entity) {
		var resource;

		if (typeof entity === 'undefined') {
			entity = representationName;
			representationName = 'default';
		}

		resource = _representations[representationName];

		if (!resource) {
			throw new Error('Representation ' + representationName + ' not found for Resource ' + _path );
		}

		return resource(entity) || entity;
	};

	['get', 'post', 'put', 'patch', 'delete', 'options'].forEach(function (action) {
		newResource[action] = fluent(variadic(function (middleware) {
				_router && (_router[action].apply(_router, [_path].concat(middleware)));
				this.actions[action] = middleware;
		}));
	});

	newResource.attachTo = setter(function (router) {
		for (var verb in this.actions) {
			router[verb].apply(router, [_path].concat(this.actions[verb]));
		}
		return this;
	});

	newResource.representation = setter(function (representations) {
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
				throw new Error('A function is needed for the ' + representations + 'representation.');
			}

			setRepresentation(representations, arguments[1]);
			return;
		}
	});

	newResource.path = function (params) {
		var path = _path;

		if (!arguments.length) return path;

		if (typeof params !== 'object' || params === null) {
			throw new Error('The Resource#path method takes an object as a parameter.');
		}

		Object.keys(params).forEach(function (f) {
			if (typeof f !== 'string') return;
			path = path.replace(f.substring(0, 1) === ':' ? f : ':' + f, params[f]);
		});

		return path;
	};

	return extend(newResource, {
		actions: {}
	});
};
