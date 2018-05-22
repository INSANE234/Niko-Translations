const { get } = require('snekfetch');
const { Command } = require('discord.js-commando');
class NekoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'neko',
      memberName: 'neko',
      group: 'search',
      description: 'Sends a random nekomimi image from nekos.brussel',
      examples: ['neko'],
      clientPermissions: ['EMBED_LINKS'],
      ownerOnly: true,
      throttling: {
        usages: 5,
        duration: 10
      }
    });
  }
  async run(msg) {
    const { body, ok } = await get('https://nekos.brussell.me/api/v1/random/image?count=100&nsfw=false');
    if(!ok) return null;
    await msg.delete({ timeout: 1000 });
    const { images } = body;
    return msg.reply(`https://nekos.brussell.me/image/${images.randomItem().id}`);
  }
}

module.exports = NekoCommand;