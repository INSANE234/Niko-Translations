const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { API_URL } = process.env;
module.exports = class Kill extends Command {
  constructor(client) {
    super(client, {
      name: 'kill',
      memberName: 'kill',
      group: 'actions',
      description: 'Kill someone :3',
      examples: ['kill @user'],
      clientPermissions: ['EMBED_LINKS'],
      guildOnly: true,
      argsCount: 1,
      argsPromptLimit: 3,
      throttling: {
        usages: 5,
        duration: 7
      },
      args: [
        {
          key: 'user',
          prompt: 'What user you want to kill?\n',
          type: 'user'
        }
      ]
    });
  }
  async run(msg, { user }) {

    if(msg.author.id === user.id) return msg.replyError('actions.kill.suicide');
    if(user.bot) return msg.replyError('actions.kill.bots');
    const { body } = await snekfetch.get(`${API_URL}/kills`).catch(() => {
      return msg.replyError('default.api.offline', 'Kill');
    });
    const permissions = msg.channel.permissionsFor(this.client.user);
    const title_emote = permissions.has('USE_EXTERNAL_EMOJIS') ? '<:SataniaGun:314125144752652288>' : '🔪';
    const emote = permissions.has('USE_EXTERNAL_EMOJIS') ? '<:AlwaysRemember:314125144513708033>' : '🔪';
    return msg.embed({
      color: this.client.colors.error,
      title: msg.guild.getKey('actions.kill', title_emote),
      description: msg.guild.getKey('actions.kill.killed', msg.author.tag, user.tag, emote),
      image: {
        url: body.kill
      }
    });
  }
};