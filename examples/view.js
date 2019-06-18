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
  let view = npm.view('listAll');
  let pkg = await view.query({
    // group_level: 4,
    startkey: JSON.stringify('micromatch'),
    endkey: JSON.stringify('micromatch')
  });

  let val = pkg[0].value;
  let latest = val.versions[val['dist-tags'].latest];
  console.log(latest);
}
