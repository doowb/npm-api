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
  let repo = npm.repo('micromatch');
  let downloads = await repo.downloads();
  console.log(downloads.length + ' days of downloads have been pulled for ' + repo.name);
  console.log();

  console.log('total:', await repo.total());
  console.log('last 30 days:', await repo.last(30));
  console.log('last 7 days:', await repo.last(7));
  console.log('last day:', await repo.last(1));
}
