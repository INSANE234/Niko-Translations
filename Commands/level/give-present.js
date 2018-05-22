const { Command, ArgumentCollector } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
module.exports = class GivePresentCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'give-present',
      memberName: 'give-present',
      aliases: ['gvprs'],
      group: 'level',
      description: 'Give a present to a user.',
      examples: ['gvprs @user'],
      guildOnly: true,
      argsPromptLimit: 3,
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'user',
          prompt: 'For which user you want to give the present?\n',
          type: 'user',
          validate: (user, msg, arg) => {
            user = this.client.registry.types.get('user').parse(user, msg, arg);
            if(!user || user.bot)
              return false;
            return true;
          }
        }
      ]
    });
  }
  async run(msg, { user }) {
    const user1 = await Service.getRow(msg.author);
    const user2 = await Service.getRow(user);
    const items = await user1.getItems();
    if(items.length < 1) 
      return msg.replyError('level.present.noItems'); 
    const string = this.formatString(items);
    await msg.say(string);
    const collector = new ArgumentCollector(this.client, [
      {
        key: 'code',
        prompt: 'Please provide the item code which you want to give to this user\n',
        type: 'integer',
        validate: code => {
          return code <= items.length;
        }
      }
    ], 3);
    const arg = await collector.obtain(msg);
    if(arg.cancelled) 
      return;
    const item = items[arg.values.code];
    await user1.removeItem(item);
    const name = item.get('item');
    if(await user2.addItem(name))
      return msg.replyConfirm('level.give-present.success',user.username);
    return msg.replyError('level.give-present.fail');
  }
  formatString(items) {
    let string = '';
    for(let i = 0; i < items.length; i++) {
      string += `[${i}]  ${items[i].get('item')} [amount: ${items[i].get('amount')}]\n`;
    }
    return `\`\`\`\n${string}\`\`\``;
  } 
};