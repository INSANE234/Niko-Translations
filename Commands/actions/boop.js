const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
const { API_URL } = process.env;
module.exports = class BoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'boop',
      group: 'actions',
      memberName: 'boop',
      description: 'Boops someone ;3',
      examples: ['boop @user', 'boop [username]'],
      clientPermissions: ['EMBED_LINKS'],
      argsPromptLimit: 3,
      guildOnly: true,
      throttling: {
        usages: 5,
        duration: 7
      },
      args: [
        {
          key: 'user',
          prompt: 'What you you want to boop?\n',
          type: 'user'
        }
      ]
    });
  }

  async run(msg, { user }) {
    if (user.id === msg.author.id) return msg.replyConfirm('actions.alone');
    const { body } = await get(`${API_URL}/boops`).catch(() => {
      return msg.replyError('default.api.offline', 'Boop');
    });
    const emojis = '<:RamKiss:301858777378848768> <:RemKiss:301858774258417674>';
    const emote = msg.guild.id === '292709515969953802' ? emojis : '❤';
    const image = body.boop;
    return msg.embed({
      color: 0xff42cc,
      title: `${emote} ${msg.guild.getKey('actions.event'), msg.guild.getKey('actions.boop')}`,
      description: msg.guild.getKey('actions.boop.action', msg.author.tag, user.tag),
      image: {
        url: image
      }
    });
  }
};