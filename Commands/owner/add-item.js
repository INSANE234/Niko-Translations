const db = require('../../Classes/SQLite').db;
const Shop = db.import('../../Data/Models/Level/Shop');
const { Command } = require('discord.js-commando');
module.exports = class AddItemCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'add-item',
      memberName: 'add-item',
      group: 'owner',
      aliases: ['addi'],
      description: 'Adds a new item into the shop database.',
      examples: ['addi name price'],
      ownerOnly: true,
      argsCount: 2,
      args: [
        {
          key: 'name',
          prompt: 'What will be the name of that item?\n',
          type: 'string'
        },
        {
          key: 'price',
          prompt: 'What will be the cost for that item?\n',
          type: 'integer'
        }
      ]
    });
  }
  async run(msg, { name, price }) {
    Shop.findOrCreate({
      where: {
        name,
        price
      }
    }).spread((item, created) => {
      if(!created)
        return msg.replyError('owner.add-item.alreadyExists');
      return msg.replyConfirm('owner.add-item.created');
    });
  }
};