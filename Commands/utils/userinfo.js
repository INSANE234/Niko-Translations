const { Command } = require('discord.js-commando');
const moment = require('moment');
module.exports = class UserinfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      group: 'utils',
      aliases: ['uinfo'],
      memberName: 'userinfo',
      description: 'Give informations for the mentioned user if have, if not the command invoker will be used',
      examples: ['uinfo', 'uinfo @user'],
      guildOnly: true,
      args: [
        {
          key: 'member',
          prompt: 'What user you want to view information about?\n',
          type: 'member',
          default: msg => msg.member
        }
      ]
    });
  }

  run(msg, { member }) {
    
    const presence = this.resolvePresence(member.presence.status);
    const permissions = msg.channel.permissionsFor(this.client.user);
    const activity = member.presence.activity;
    return msg.embed({
      color: this.client.colors.ok,
      author: {
        name: member.displayName,
        icon_url: member.user.displayAvatarURL()
      },
      fields: [
        {
          name: 'ID',
          value: member.id,
          inline: true
        },
        {
          name: msg.guild.getKey('utils.user-info.joined'),
          value: moment(member.joinedAt).format('DD-MM-YYYY HH:mm:ss') || '?',
          inline: true
        },
        {
          name: msg.guild.getKey('utils.user-info.joinedDiscord'),
          value: moment(member.user.createdTimestamp).format('DD-MM-YYYY HH:mm:ss') || '?',
          inline: true
        },
        {
          name: msg.guild.getKey('utils.user-info.roles'),
          value: `**(${member.roles.size - 1})** ${member.roles.filter(r => r.id !== msg.guild.id).map(r => r.name).splice(0, 5).join('\n')}`,
          inline: true
        },
        {
          name: 'Status',
          value: permissions.has('USE_EXTERNAL_EMOJIS') ? presence : member.presence.status
        }
      ],
      footer: {
        text: msg.guild.getKey('utils.user-info.playing', activity ? activity.name : msg.guild.getKey('utils.user-info.notPlaying'))
      }
    });

  }
  resolvePresence(status) {
    switch (status) {
      case 'online':
        return '<:online:443793227938660369>';
      case 'offline':
        return '<:offline:325415161617711114>';
      case 'idle':
        return '<:idle:325415148279824390>';
      case 'dnd':
        return '<:dnd:325415133054500864>';
    }
  }
};