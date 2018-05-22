const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cat',
      aliases: ['meow'],
      group: 'search',
      memberName: 'cat',
      description: 'Sends a random cat image from random.cat',
      examples: ['cat'],
      clientPermissions: ['ATTACH_FILES'],
      throttling: {
        usages: 3,
        duration: 10
      }
    });
  }

  async run(msg) {
    const { body } = await get('http://thecatapi.com/api/images/get').catch(() => {
      return null;
    });
    return msg.say(msg.author, { files: [{ attachment: body, name: `${Math.floor(Math.random() * 999 )}.png` }] });
  }
}

module.exports = CatCommand;