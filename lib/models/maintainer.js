'use strict';

const Base = require('./base.js');
const utils = require('../utils.js');
const config = require('../config.js');

/**
 * Maintainer constructor. Create an instance of an npm maintainer by maintainer name.
 *
 * ```js
 * const maintainer = new Maintainer('doowb');
 * ```
 *
 * @param {String} `name` Name of the npm maintainer to get information about.
 * @name Maintainer
 * @api public
 */

class Maintainer extends Base {
  constructor(name) {
    super();
    this.name = name;
    this.config = {...config};
  }

  /**
   * Get the repositories owned by this maintainer.
   *
   * ```js
   * maintainer.repos()
   *   .then(function(repos) {
   *     console.log(repos);
   *   }, function(err) {
   *     console.error(err);
   *   });
   * ```
   *
   * @return {Promise} Returns array of repository names when promise resolves.
   * @name .repos
   * @api public
   */

  async repos() {
    if (!this.cache.has('repos')) {
      let from = 0;
      let size = 250;
      let url = `${this.config.registry}-/v1/search?text=maintainer:${this.name}&size=${size}`;
      let results = [];
      await utils.paged(url, (_, res, acc) => {
        let { objects, total } = res.data;
        results.push(...objects);
        if (total >= (from + size)) {
          from += size;
          return `${url}&from=${from}`;
        }
      });

      this.cache.set('repos', results.map(obj => obj.package.name));
    }
    return this.cache.get('repos');
  }
}

/**
 * Exposes `Maintainer`
 */

module.exports = Maintainer;
