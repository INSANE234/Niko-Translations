const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dog',
      aliases: ['woof', 'au'],
      group: 'search',
      memberName: 'dog',
      description: 'Sends a random dog image from random.dog',
      examples: ['dog'],
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async run(msg) {
    const { text, ok } = await get('http://random.dog/woof');
    if(!ok) return null;
    if(text.includes('mp4')) 
      return msg.channel.sendOk(msg.getKey('search.dog.video', `http://random.dog/${text}`));
    return msg.embed({
      color: this.client.colors.ok,
      image: `http://random.dog/${text}`,
      footer: {
        text: 'Powered by random.dog'
      }
    });
  }
}

module.exports = DogCommand;