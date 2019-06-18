'use strict';

const NpmApi = require('../');
const npm = new NpmApi();

run()
  .then(() => {
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function run() {
  let maintainer = npm.maintainer('doowb');
  let repos = await maintainer.repos();
  console.log(repos);
}
