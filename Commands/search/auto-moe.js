const { Command } = require('discord.js-commando');
const { getMoe } = require('../search/moe');
const sherlock = require('sherlockjs');
class AutoMoeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'auto-moe',
      memberName: 'auto-moe',
      aliases: ['autm'],
      group: 'search',
      description: 'Sends a random image with an predetermined interval',
      examples: ['autm [tags]', 'autm chibi'],
      clientPermissions: ['EMBED_LINKS'],
      guildOnly: true,
      ownerOnly: true, // Only owner due to rate-limit
      argsSingleQuotes: true,
      argsPromptLimit: 3,
      args: [
        {
          key: 'tags',
          prompt: 'What tags you want to search for?\n',
          type: 'string',
          default: ''
        },
        {
          key: 'timer',
          label: 'timer',
          prompt: 'what would you like me to remind you about?\n',
          type: 'string',
          validate: time => {
            const t = sherlock.parse(time);
            if (!t.startDate) return 'please provide a valid time.';
            if(t.startDate.getTime() - Date.now() < 59000) 
              return 'The interval must be greater than 60 seconds!';
            return true;
          },
          parse: time => sherlock.parse(time).startDate.getTime() - Date.now(),
          default: ''
        }
      ]
    });
    this.guilds = new Map();
  }

  async run(msg, { tags, timer }) {
    if(!tags || !timer) {
      if(!this.guilds.has(msg.guild.id))
        return null;
      const interval = this.guilds.get(msg.guild.id);
      this.client.clearInterval(interval);
      return msg.replyConfirm('search.auto-moe.disabled');
    }
    if(!timer) 
      return null;
    if(this.guilds.has(msg.guild.id)) return null;
    const interval = this.client.setInterval(async () => await this.autoMoe(msg, tags, this.client), timer);
    this.guilds.set(msg.guild.id, interval);
    await msg.replyConfirm('search.auto-moe.success');
    return msg.delete({ timeout: 3000 });
  }
  async autoMoe(msg, tags, client) {
    const image = await getMoe(tags);
    return msg.embed({
      color: client.colors.love,
      image: {
        url: image
      }
    });
  }
}

module.exports = AutoMoeCommand;