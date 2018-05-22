const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { API_URL } = process.env;
module.exports = class CheekKiss extends Command {
  constructor(client) {
    super(client, {
      name: 'cheek',
      group: 'actions',
      memberName: 'cheek',
      aliases: ['ck'],
      description: 'Give a cheek kiss in the specified user ;3!',
      examples: ['ck @user', 'ck user'],
      clientPermissions: ['EMBED_LINKS'],
      format: ' @user',
      argsPromptLimit: 3,
      argsCount: 1,
      guildOnly: true,
      throttling: {
        usages: 5,
        duration: 7
      },
      args: [
        {
          key: 'user',
          prompt: 'What user you want to give a cheek kiss?\n',
          type: 'user'
        }
      ]
    });
  }
  async run(msg, { user }) {
    if(user.id === msg.author.id) return msg.replyConfirm('actions.alone');
    const { body } = await snekfetch.get(`${API_URL}/cheek`).catch(() => {
      return msg.replyError('default.api.offline', 'Cheek');
    });
    return msg.embed({
      color: this.client.colors.love,
      description: msg.guild.getKey('actions.cheekKiss.action', msg.author.tag, user.tag),
      image: {
        url: body.cheek
      }
    });
  } 
};