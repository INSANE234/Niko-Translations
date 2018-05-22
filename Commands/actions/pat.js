const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
module.exports = class Pat extends Command {
  constructor(client) {
    super(client, {
      name: 'pat',
      group: 'actions',
      memberName: 'pat',
      description: 'Pats someone \'u\'',
      examples: ['pat @user'],
      clientPermissions: ['EMBED_LINKS'],
      guildOnly: true,
      argsPromptLimit: 3,
      argsCount: 1,
      throttling: {
        usages: 5,
        duration: 7
      },
      args: [
        {
          key: 'user',
          prompt: 'What user you want to pat?\n',
          type: 'user'
        }
      ]
    });
  }

  async run(msg, { user }) {
    if (user.id === msg.author.id) return null;
    const permissions = msg.channel.permissionsFor(this.client.user);
    const { body } = await snekfetch.get('https://rra.ram.moe/i/r?type=pat').catch(() => {
      return msg.replyError('default.api.offline', 'Pat');
    });
    return msg.embed({
      color: this.client.colors.love,
      title: `${permissions.has('USE_EXTERNAL_EMOJIS') ? '<:kanoyaa:378681964787400705>' : '🤚'} Pat Event`,
      description: msg.guild.getKey('actions.pat.action', msg.author.tag, user.tag),
      image: {
        url: this.client.registry.resolveCommand('actions:kiss').getURL(body.path)
      }
    });
  }
};