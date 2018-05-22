const db = require('../Classes/SQLite').db;
const join = require('path').join;
const Shop = db.import(join('..', 'Data', 'Models', 'Level/Shop'));
module.exports = async () => {
  await Promise.all([
    Shop.upsert({ name: 'Coffee', price: 1000 }),
    Shop.upsert({ name: 'Cake', price: 1500 }),
    Shop.upsert({ name: 'Pancake', price: 300 }),
    Shop.upsert({ name: 'LightBulb', price: 10000 }),
    Shop.upsert({ name: 'Niko Hat', price: 8000 }),
    Shop.upsert({ name: 'bg_ruevision', price: 5000 }),
    Shop.upsert({ name: 'bg_solflight', price: 5500 }),
    Shop.upsert({ name: 'bg_solflight4', price: 5500 }),
    Shop.upsert({ name: 'bg_solmine', price: 6000 }),
    Shop.upsert({ name: 'bg_visiongreen', price: 6000 })
  ]);
  return true;
};