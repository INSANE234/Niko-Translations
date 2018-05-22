const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
class MoeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'moe',
      group: 'search',
      memberName: 'moe',
      description: 'Sends a random image of awwnime based on the tags provided.',
      examples: ['moe [tags]', 'moe chibi'],
      clientPermissions: ['EMBED_LINKS'],
      guildOnly: true,
      argsPromptLimit: 3,
      args: [
        {
          key: 'tags',
          prompt: 'What tags you want to search for?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { tags }) {
    const image = await MoeCommand.getMoe(tags);
    if(msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) 
      msg.delete({ timeout: 1000 }).catch(() => {}); 
    return msg.reply(`tags: **${tags}**\n${image}`);
    
  }
  static async getMoe(tags) {
    const { body: moe, ok } = await get(`https://awwnime.redditbooru.com/images/?limit=100&q=${encodeURIComponent(tags)}`);
    if(!ok) return null;
    if(moe.length < 1) return null;
    const image = moe.randomItem().cdnUrl;
    return image;
  }
}

module.exports = MoeCommand;