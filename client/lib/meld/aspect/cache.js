/**
 * Caching aspect
 * Requires JSON.stringify. See cujojs/poly if you need a JSON polyfill
 * @author: brian@hovercraftstudios.com
 */
(function(define) {
define(function() {
	/**
	 * Creates a new caching aspect that uses the supplied cache
	 * to store values using keys generated by the supplied keyGenerator.
	 *
	 * Requires JSON.stringify. See cujojs/poly if you need a JSON polyfill
	 *
	 * @param {object} cache
	 * @param {function} cache.has returns true if a supplied key exists in the cache
	 * @param {function} cache.get returns the value associated with the supplied key
	 * @param {function} cache.set associates the supplied key with the supplied value
	 * @param {function} [keyGenerator] creates a hash key given an array. Used to generate
	 *  cache keys from function invocation arguments
	 * @return {object} caching aspect that can be added with meld.add
	 */
	return function(cache, keyGenerator) {
		if(!keyGenerator) {
			keyGenerator = JSON.stringify;
		}

		return {
			around: function(joinpoint) {
				var key, result;

				key = keyGenerator(joinpoint.args);

				if(cache.has(key)) {
					result = cache.get(key);
				} else {
					result = joinpoint.proceed();
					cache.set(key, result);
				}

				return result;
			}
		}
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
