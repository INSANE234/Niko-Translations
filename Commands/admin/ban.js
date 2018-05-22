const { Command } = require('discord.js-commando');

class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      memberName: 'ban',
      group: 'admin',
      aliases: ['b'],
      description: 'Bans a member by ID or name with an optional message.',
      examples: ['b @Member You is toxic'],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      guildOnly: true,
      argsPromptLimit: 3,
      args: [
        {
          key: 'member',
          prompt: 'What member you want to ban?\n',
          type: 'member',
          validate: (member, msg, arg) => {
            member = this.client.registry.types.get('member').parse(member, msg, arg);
            if(!member)
              return false;
            if(member.bannable && member.user.id !== msg.author.id) return true;
            return msg.guild.getKey('admin.ban.hierarchy');
          }
        },
        {
          key: 'reason',
          prompt: 'What is the reason for banning this member?\n',
          type: 'string',
          default: 'No reason provided',
          max: 400
        }
      ]
    });
  }

  async run(msg, { member, reason }) {
    const bm = await msg.replyError('admin.ban.reallyWant');
    const col = await msg.channel.awaitMessages(m => m.author.id === msg.author.id && m.content.toLowerCase().match(/^n|y|s$/), {
      max: 1,
      time: 60000,
      errors: ['time']
    }).catch(() => {
      return bm.delete({ timeout: 1000 });
    });
    if(col.first().content === 'n') 
      return bm.delete({ timeout: 1000 });
    await bm.delete({ timeout: 1000 });
    await member.ban({
      days: 2,
      reason: reason
    });
    return msg.channel.sendLog('Ban', member.user, msg.author, reason);
  }
}

module.exports = BanCommand;