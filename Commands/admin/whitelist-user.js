const { Command } = require('discord.js-commando');
class WhiteListCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'whitelist-user',
      memberName: 'whitelist-user',
      aliases: ['whtlu', 'wlu'],
      group: 'admin',
      description: 'whitelist a member for use the bot in this guild.',
      examples: ['wlu @someMember'],
      guildOnly: true, 
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'member',
          prompt: 'Which member you want to whitelist in this guild?\n',
          type: 'member',
          validate: (member, msg, arg) => {
            member = this.client.registry.types.get('member').parse(member, msg, arg);
            if(!member)
              return false;
            if(!member.user.bot) return true;
            return 'The member cannot be a bot!\n';
          }
        }
      ]
    });
  }

  run(msg, { member }) {
    const blacklist = msg.guild.settings.get('blacklist', []);
    if(!blacklist.includes(member.user.id)) 
      return msg.replyError('admin.whitelist.notBlacklisted');
    const index = blacklist.indexOf(member.user.id);
    blacklist.splice(index, 1);
    msg.guild.settings.set('blacklist', blacklist);
    return msg.replyConfirm(msg.guild.getKey('admin.whitelist.success'));
  }
}

module.exports = WhiteListCommand;