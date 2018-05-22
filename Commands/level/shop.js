const { Command, ArgumentCollector } = require('discord.js-commando');
const db = require('../../Classes/SQLite').db;
const shop = db.import('../../Data/Models/Level/Shop');
const Service = require('../../Classes/Services/LevelService');
module.exports = class ShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shop',
      memberName: 'shop',
      group: 'level',
      description: 'Open the shop',
      examples: ['shop'],
      guildOnly: true,
      argsPromptLimit: 3,
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }
  async run(msg) {
    const items = await shop.findAll();
    const string = this.formatString(items);
    await msg.say(string);
    const collector = new ArgumentCollector(this.client, [
      {
        key: 'code',
        prompt: 'Please provide the item code which you want to buy\n',
        type: 'integer',
        validate: code => {
          return code <= items.length - 1;
        }
      }
    ], 3);
    const arg = await collector.obtain(msg);
    if(arg.cancelled) 
      return;
    const item = items[arg.values.code];
    const user = await Service.getRow(msg.author);
    await user.removeMoney(item.get('price'));
    if(!await user.addItem(item.get('name')))
      return msg.replyError('level.shop.duplicate');
    return msg.replyConfirm('level.shop.successfully');
  }
  formatString(items) {
    let string = '';
    items.forEach((item, index) => {
      string += `${index} - ${item.get('name')} [price: ${item.get('price')}]\n`;
    });
    return `\`\`\`\n${string}\`\`\``;
  } 
};