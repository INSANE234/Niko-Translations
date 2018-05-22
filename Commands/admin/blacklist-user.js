const { Command } = require('discord.js-commando');
class BlackListCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'blacklist-user',
      memberName: 'blacklist-user',
      aliases: ['blklu'],
      group: 'admin',
      description: 'Blacklist a member for use the bot in this guild.',
      examples: ['blklu @someMember'],
      guildOnly: true, 
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'member',
          prompt: 'Which member you want to blacklist in this guild?\n',
          type: 'member',
          validate: (member, msg, arg) => {
            member = this.client.registry.types.get('member').parse(member, msg, arg);
            if(!member || member.user.bot)
              return false;
          }
        }
      ]
    });
  }

  async run(msg, { member }) {
    const blacklist = msg.guild.settings.get('blacklist', []);
    if(blacklist.includes(member.user.id)) 
      return msg.replyError('admin.blacklist.already');
    const isHigh = msg.member.highestRole.comparePositionTo(member.highestRole) >= 0;
    if(!isHigh || !this.client.isOwner(member.user))
      return msg.replyError('admin.blacklist.hierarchy');
    blacklist.push(member.user.id);
    await msg.guild.settings.set('blacklist', blacklist);
    return msg.channel.sendOk(msg.guild.getKey('admin.blacklist.success'));
  }
}

module.exports = BlackListCommand;