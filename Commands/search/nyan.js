const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
module.exports = class Nyan extends Command {
  constructor(client) {
    super(client, {
      name: 'nyan',
      group: 'search',
      memberName: 'nyan',
      description: 'Sends a random nekomimi image',
      examples: ['nyan'],
      clientPermissions: ['EMBED_LINKS']
    });
  }

  async run(msg) {
    const { body, ok } = await snekfetch.get('https://nekos.life/api/neko');
    if(!ok) return null;
    const { neko } = body;
    if(msg.guild && msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES'))
      await msg.delete({ timeout: 1000 });
    return msg.embed({
      color: this.client.colors.ok,
      image: {
        url: neko
      },
      footer: {
        text: 'Powered by nekos.life'
      }
    });
  }
};
