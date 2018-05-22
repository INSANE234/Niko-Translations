const { Command } = require('discord.js-commando');
module.exports = class Softban extends Command {
  constructor(client) {
    super(client, {
      name: 'softban',
      memberName: 'softban',
      aliases: ['sb'],
      group: 'admin',
      description: 'Bans and then unbans a user by ID or name with an optional message.',
      examples: ['softban [user] [reason]'],
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
      guildOnly: true,
      args: [
        {
          key: 'member',
          prompt: 'What member you want to apply the softban?\n',
          type: 'member',
          validate: (member, msg, arg) => {
            member = this.client.registry.types.get('member').parse(member, msg, arg);
            if(!member)
              return false;
            if(member.bannable && member.user.id !== msg.author.id) return true;
            return msg.guild.getKey('admin.hierarchy');
          }
        },
        {
          key: 'reason',
          prompt: 'What is the reason for banning this member?\n',
          type: 'string',
          default: 'No reason was provided',
          max: 400
        }
      ]
    });
  }
  async run(msg, { member, reason }) {
    await member.ban({
      days: 2,
      reason: reason
    });
    this.client.setTimeout(() => msg.guild.unban(member), 60000);
    return msg.channel.sendLog('Softban', member.user, msg.author, reason);
  }
};
