'use strict';

require('mocha');
var assert = require('assert');
var NpmApi = require('./');
var npm;

describe('npm-api', function() {
  beforeEach(function() {
    npm = new NpmApi();
  });

  it('should export a function', function() {
    assert.equal(typeof NpmApi, 'function');
  });

  it('should create a new instance', function() {
    assert(npm);
  });

  describe('maintainer', function() {
    it('should create a new maintainer instance', function() {
      var maintainer = npm.maintainer('doowb');
      assert(maintainer);
      assert.equal(maintainer.name, 'doowb');
    });

    it('should cache maintainer instances', function() {
      var maintainer = npm.maintainer('doowb');
      assert(maintainer);
      assert.equal(maintainer.name, 'doowb');
      assert.deepEqual(maintainer, npm.maintainer('doowb'));
    });

    it('should get all the repositories for a maintainer', function(cb) {
      this.timeout(10000);
      var maintainer = npm.maintainer('doowb');
      maintainer.repos()
        .then(function(repos) {
          assert(repos.length > 0, 'expected repos to contain repos');
          cb();
        })
        .catch(cb);
    });
  });

  describe('repo', function() {
    it('should create a new repo instance', function() {
      var repo = npm.repo('assemble');
      assert(repo);
      assert.equal(repo.name, 'assemble');
    });

    it('should cache repo instances', function() {
      var repo = npm.repo('assemble');
      assert(repo);
      assert.equal(repo.name, 'assemble');
      assert.deepEqual(repo, npm.repo('assemble'));
    });

    it('should get downloads for a repository', function(cb) {
      this.timeout(10000);
      var repo = npm.repo('assemble');
      repo.downloads()
        .then(function(downloads) {
          assert(downloads.length > 0, 'expected downloads to contain downloads');
          cb();
        })
        .catch(cb);
    });
  });
});
