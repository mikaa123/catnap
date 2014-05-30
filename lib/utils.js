var __slice = Array.prototype.slice;

function getWith(attr) {
	return function (object) { return object[attr]; };
}

function mapWith(fn) {
	return function (list) {
		return Array.prototype.map.call(list, fn);
	};
}

function variadic(fn) {
	var fnLength = fn.length;

	if (fnLength < 1) {
		return fn;
	} else if (fnLength === 1)  {
		return function () {
			return fn.call(
				this, __slice.call(arguments, 0));
		};
	} else {
		return function () {
			var numberOfArgs = arguments.length,
			namedArgs = __slice.call(arguments, 0, fnLength - 1),
			numberOfMissingNamedArgs = Math.max(fnLength - numberOfArgs - 1, 0),
			argPadding = new Array(numberOfMissingNamedArgs),
			variadicArgs = __slice.call(arguments, fn.length - 1);
			return fn.apply(
				this, namedArgs
						.concat(argPadding)
						.concat([variadicArgs]));
		};
	}
}

function fluent(fn) {
	return function () {
		fn.apply(this, arguments);
		return this;
	};
}

function maybe (fn) {
	return function () {
		var i;

		if (!arguments.length) return;

		for (i = 0; i < arguments.length; ++i) {
			if (arguments[i] == null) return;
		}

		return fn.apply(this, arguments);
	};
}

function extend() {
	var consumer = arguments[0],
		providers = __slice.call(arguments, 1),
		provider,
		key,
		i;

	for (i = 0; i < providers.length; ++i) {
		provider = providers[i];
		for (key in provider) {
			if (provider.hasOwnProperty(key)) {
				consumer[key] = provider[key];
			}
		}
	}

	return consumer;
}

function compose(a, b) {
	return function (c) {
		return a(b(c));
	};
}

var pick = variadic(function (obj, keys) {
	var res = {};

	if (!keys.length) return obj;

	keys.forEach(function (key) {
		obj[key] && (res[key] = obj[key]);
	});

	return res;
});

module.exports = {
	getWith: getWith,
	mapWith: mapWith,
	variadic: variadic,
	fluent: fluent,
	maybe: maybe,
	compose: compose,
	extend: extend,
	pick: pick
};
