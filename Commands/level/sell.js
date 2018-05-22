const { Command, ArgumentCollector } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
module.exports = class GivePresentCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sell',
      memberName: 'sell',
      aliases: ['sli', 'sl'],
      group: 'level',
      description: 'Sell an item.',
      examples: ['sl item1...'],
      guildOnly: true,
      argsPromptLimit: 3,
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }
  async run(msg) {
    const user = await Service.getRow(msg.author);
    const items = await user.getItems();
    if(items.length < 1) 
      return msg.replyError('level.default.noItems'); 
    const string = this.formatString(items);
    await msg.say(string);
    const collector = new ArgumentCollector(this.client, [
      {
        key: 'code',
        prompt: 'Please provide the item code to sell and the amount eg. 0 2\n',
        type: 'integer',
        validate: code => {
          return code <= items.length;
        }
      },
      {
        key: 'amount',
        prompt: '...',
        type: 'integer',
        default: 1
      }
    ], 3);
    const arg = await collector.obtain(msg);
    if(arg.cancelled) 
      return;
    const item = items[arg.values.code];
    await user.sellItem(item, arg.values.amount);
    return msg.replyError('level.sell.success');
  }
  formatString(items) {
    let string = '';
    for(let i = 0; i < items.length; i++) {
      string += `[${i}]  ${items[i].get('item')} [amount: ${items[i].get('amount')}]\n`;
    }
    return `\`\`\`\n${string}\`\`\``;
  } 
};