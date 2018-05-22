const { Command } = require('discord.js-commando');
module.exports = class Warn extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      group: 'admin',
      aliases: ['w'],
      memberName: 'warn',
      description: 'Warn a mentioned user.',
      examples: ['warn [user] [reason]'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Which user you want to warn?\n',
          type: 'user',
          validate:  (user, msg, arg) => {
            user = this.client.registry.types.get('user').parse(user, msg, arg);
            if(!user || user.id === msg.author.id)
              return msg.guild.getKey('admin.warn.error');
            if(user.bot)
              return msg.guild.getKey('admin.warn.bots');
            return true;
          }
        },
        {
          key: 'reason',
          prompt: 'What\'s the reason for warn that member?\n',
          type: 'string'
        }
      ]
    });
  }
  hasPermission(msg) {
    if(msg.member.permissions.has('BAN_MEMBERS') || 
    msg.member.permissions.has('KICK_MEMBERS')) return true;
    return false;
  }
  async run(msg, { user, reason }) {
    try {
      await user.send({embed: {
        color: this.client.colors.warn,
        title: msg.guild.getKey('admin.warn.warned', msg.guild.name),
        description: `**${msg.guild.getKey('admin.moderator')}** ${msg.author.tag}\n**${msg.guild.getKey('admin.reason')}** ${reason}`,
        timestamp: new Date()
      }
      }).catch(() => {});
      return msg.channel.sendLog('Warn', user, msg.author, reason);
    } catch(e) {
      this.client.logger.error(e.stack);
      return null;
    }
  }
};
