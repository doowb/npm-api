'use strict';

const url = require('url');
const utils = require('./utils');
const config = require('./config');

/**
 * View constructor. Create an instance of a view associated with a couchdb view in the npm registry.
 *
 * ```js
 * const view = new View('dependedUpon');
 * ```
 *
 * @param {String} `name` Name of couchdb view to use.
 * @returns {Object} instance of `View`
 * @api public
 */

class View {
  constructor(name) {
    this.name = name;
    this.config = utils.clone(config);
    this.config.pathname += '/_view/' + this.name;
  }

  /**
   * Query the couchdb view with the provided parameters.
   *
   * ```js
   * let results = await view.query({
   *   group_level: 2,
   *   startkey: JSON.stringify(['micromatch']),
   *   endkey: JSON.stringify(['micromatch', {}])
   * });
   * ```
   * @param  {Object} `params` URL query parameters to pass along to the couchdb view.
   * @return {Promise} Results of the query when promise is resolved.
   * @api public
   */

  query(params = {}) {
    return new Promise((resolve, reject) => {
      let items = [];
      let header = {};
      utils.request(this.url(params))
        .once('error', reject)
        .pipe(utils.JSONStream.parse('rows.*'))
        .on('header', (data) => {
          header = data;
          if (header.error) {
            reject(new Error(header.reason || header.error));
          }
        })
        .on('data', (data) => {
          items.push(data);
        })
        .once('error', reject)
        .once('end', () => {
          resolve(items);
        });
    });
  }

  /**
   * Query the couchdb view with the provided parameters and return a stream of results.
   *
   * ```js
   * view.stream({
   *   group_level: 2,
   *   startkey: JSON.stringify(['micromatch']),
   *   endkey: JSON.stringify(['micromatch', {}])
   * })
   * .on('data', (data) => {
   *   console.log(data);
   * });
   * ```
   * @param  {Object} `params` URL query parameters to pass along to the couchdb view.
   * @return {Stream} Streaming results of the query.
   * @api public
   */

  stream(params = {}) {
    return utils.request(this.url(params))
      .pipe(utils.JSONStream.parse('rows.*'));
  }

  /**
   * Build a formatted url with the provided parameters.
   *
   * @param  {Object} `query` URL query parameters.
   * @return {String} formatted url string
   * @api public
   */

  url(query = {}) {
    return url.format({ ...this.config, query });
  }
}

/**
 * Exposes `View`
 */

module.exports = View;
