'use strict';

const utils = require('./utils');
const config = require('./config');

/**
 * Registry constructor. Create an instance of a registry for querying registry.npmjs.org directly.
 *
 * ```js
 * const registry = new Registry();
 * ```
 *
 * @returns {Object} instance of `Registry`
 * @api public
 */

class Registry {
  constructor() {
    this.config = utils.clone(config);
  }

  /**
   * Get the package.json for the specified repository.
   *
   * ```js
   * let results = await registry.get('micromatch')
   * ```
   * @param  {String} `name` Repository name to get.
   * @return {Promise} Results of the query when promise is resolved.
   * @api public
   */

  get(name) {
    return new Promise((resolve, reject) => {
      utils.request.get(this.url(name), (err, res, body) => {
        if (err) return reject(err);
        try {
          let data = JSON.parse(body);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Build a formatted url
   *
   * @param  {String} `name` Repo name.
   * @return {String} formatted url string
   * @api public
   */

  url(name) {
    if (name[0] === '@' && name.indexOf('/') !== -1) {
      name = '@' + encodeURIComponent(name.slice(1));
    }
    return this.config.registry + name;
  }
}

/**
 * Exposes `Registry`
 */

module.exports = Registry;
