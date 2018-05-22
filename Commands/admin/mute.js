const { Command } = require('discord.js-commando');
module.exports = class Mute extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      group: 'admin',
      memberName: 'mute',
      description: 'mutes or unmutes the mentioned user',
      examples: ['mute [user] [reason]'],
      guildOnly: true,
      userPermissions: ['MUTE_MEMBERS'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [
        {
          key: 'member',
          prompt: 'What member you want to mute?\n',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'What is the reason for mute that member?\n',
          type: 'string',
          default: '...',
          max: 100
        }]
    });
  }

  async run(msg, { member, reason }) {
    try {
      if(member.user.id === msg.author.id) return msg.replyError('admin.mute.yourself');
      if(!member.bannable) return msg.replyError('admin.hierarchy');
      let muteRole = await msg.guild.roles.find('name', 'muted');
      if (!muteRole) {
        muteRole = await msg.guild.roles.create({
          data: {
            name: 'muted',
            color: 'GREY',
            mentionable: false,
            permissions: 0
          },
          reason: 'Necessary role for mute command.'
        });
      }
      if (member.roles.has(muteRole.id)) {
        await member.roles.remove(muteRole);
        return msg.channel.sendLog('Un/mute', member.user, msg.author, reason);
      } else {
        await member.roles.add(muteRole);
        return msg.channel.sendLog('Un/mute', member.user, msg.author, reason);
      } 
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
};
