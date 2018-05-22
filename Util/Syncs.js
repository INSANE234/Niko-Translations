const db = require('../Classes/SQLite').db;
const join = require('path').join;
const insertItems = require('./insertItems');
module.exports = async () => {
  db.import(join('..', 'Data', 'Models', 'Level/Shop'));
  db.import(join('..', 'Data', 'Models', 'Level/Profiles'));
  db.import(join('..', 'Data', 'Models', 'Level/Inventories'));
  db.import(join('..', 'Data', 'Models', 'Donators'));
  db.import(join('..', 'Data', 'Models', 'Reminders'));
  db.import(join('..', 'Data', 'Models', 'Streams'));
  db.import(join('..', 'Data', 'Models', 'Tags'));
  await db.sync();
  await insertItems();

  return true;
};