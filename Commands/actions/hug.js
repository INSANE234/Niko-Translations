const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { API_URL } = process.env;
module.exports = class Hug extends Command {
  constructor(client) {
    super(client, {
      name: 'hug',
      group: 'actions',
      memberName: 'hug',
      description: 'Hug someone :3',
      examples: ['hug @user', 'hug [username]'],
      format: '@user',
      clientPermissions: ['EMBED_LINKS'],
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
          prompt: 'What user you want to hug?\n',
          type: 'user'
        }
      ]
    });
  }
  //aaa
  async run(msg, { user }) {
    if (user.id === msg.author.id) return msg.replyConfirm('actions.alone');
    const { body } = await snekfetch.get(`${API_URL}/hugs`).catch(() => {
      return msg.replyError('default.api.offline', 'Hug');
    });
    const permissions = msg.channel.permissionsFor(this.client.user);
    const emoji = permissions.has('USE_EXTERNAL_EMOJIS') ? '<:WooooAkari:307175160392450059>' : '💛';
    return msg.embed({
      color: this.client.colors.love,
      title: msg.guild.getKey('actions.hug', emoji),
      description: msg.guild.getKey('actions.hug.action', msg.author.tag, user.tag),
      image: {
        url: body.hug
      }
    });
  }
};