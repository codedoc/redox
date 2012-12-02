
/**
 * Constructor
 * return something cool
 *
 */

function Constructor (options) {
  this.options = options;
}

/**
 * method
 * do something cool
 * 
 * @param {String} secret secret param.
 * @return {Boolean} `true` or `false`.
 * @api public
 */

Constructor.prototype.method = function (secret) {
  return secret === '' ? true : false;
};
