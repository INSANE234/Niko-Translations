const { Command } = require('discord.js-commando');
module.exports = class Unban extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      group: 'admin',
      memberName: 'unban',
      description: 'Unbans the mentioned user.',
      examples: ['unban [id] [reason]', 'unban 984859827466251 He is good now'],
      guildOnly: true,
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'id',
          prompt: 'What\'s the id of the user to unban?\n',
          type: 'id'
        },
        {
          key: 'reason',
          prompt: 'Which is the reason for unbanning this member?\n',
          type: 'string',
          default: 'No reason provided',
          max: 400
        }
      ]
    });
  }

  async run(msg, { id, reason }) {
    if(id === msg.author.id) return null;
    const bans = await msg.guild.fetchBans();
    const ban = bans.get(id);
    if(!ban)
      return msg.replyError('admin.unban.cannotFind');
    await msg.guild.unban(ban.id, reason);
    return msg.channel.sendLog('Unban', ban.user, msg.author, reason);
  }
};
