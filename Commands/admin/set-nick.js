const { Command } = require('discord.js-commando');
class SetNickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set-nick',
      memberName: 'set-nick',
      aliases: ['sn', 'stn'],
      group: 'admin',
      description: 'Set\'s the new nickname for a member',
      examples: ['stn [nick] [member]'],
      guildOnly: true,
      clientPermissions: ['MANAGE_NICKNAMES'],
      args: [
        {
          key: 'nick',
          prompt: 'New nickname',
          type: 'string'
        },
        {
          key: 'member',
          prompt: 'Member to update the nickname',
          type: 'member'
        }]
    });
  }

  async run(msg, { nick, member }) {
    if(msg.member !== member && !msg.member.permissions.has('MANAGE_NICKNAMES')) return msg.replyError('admin.set-nick.noPermission');
    await member.setNickname(nick);
    return msg.replyConfirm('admin.set-nick.set');
  }
}

module.exports = SetNickCommand;