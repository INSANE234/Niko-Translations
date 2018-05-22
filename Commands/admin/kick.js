const { Command } = require('discord.js-commando');

class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      memberName: 'kick',
      group: 'admin',
      aliases: ['k'],
      description: 'Kicks a member by ID or name with an optional message.',
      examples: ['k @Member You are toxic'],
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      guildOnly: true,
      argsPromptLimit: 3,
      args: [
        {
          key: 'member',
          prompt: 'What member you want to kick?\n',
          type: 'member',
          validate: (member, msg, arg) => {
            member = this.client.registry.types.get('member').parse(member, msg, arg);
            if(!member)
              return false;
            if(member.kickable && member.user.id !== msg.author.id) return true;
            return 'Check if the member is not you or if my role is above the member role!';
          }
        },
        {
          key: 'reason',
          prompt: 'What is the reason for kicking this member?\n',
          type: 'string',
          default: 'No reason provided',
          max: 400
        }
      ]
    });
  }
  async run(msg, { member, reason }) {
    if(!member.kickable) 
      return msg.replyError('admin.hierarchy');
    const km = await msg.replyError('admin.kick.reallyWant');
    const col = await msg.channel.awaitMessages(m => m.author.id === msg.author.id && m.content.toLowerCase().match(/^n|y|s/), {
      max: 1,
      time: 60000,
      errors: ['time']
    }).catch(() => {
      return km.delete({ timeout: 1000 });
    });
    if(col.first().content === 'n') return km.delete({ timeout: 1000 });
    await km.delete({ timeout: 1000 });
    await member.kick(reason);
    return msg.channel.sendLog('Kick', member.user, msg.author, reason);
  }
}

module.exports = KickCommand;