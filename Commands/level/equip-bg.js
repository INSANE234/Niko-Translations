const { Command, ArgumentCollector } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
module.exports = class EquipBGCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'equip-bg',
      memberName: 'equip-bg',
      group: 'level',
      description: 'Change your profile background.',
      examples: ['equip-bg'],
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
    const items = await user.getBackgrounds();
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
    const background = items[arg.values.code];
    if(await user.setBackground(background.get('item')))
      return msg.replyConfirm('level.equip-bg.equipped');
    return msg.replyError('level.equip-bg.fail');
  }
  formatString(items) {
    let string = '';
    for(let i = 0; i < items.length; i++) {
      string += `[${i}]  ${items[i].get('item')}\n`;
    }
    return `\`\`\`\n${string}\`\`\``;
  } 
};