const { Command } = require('discord.js-commando');
const moment = require('moment');
module.exports = class ServerInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      group: 'utils',
      memberName: 'serverinfo',
      description: 'Give informations about the server which command is invoked',
      examples: ['serverinfo'],
      clientPermissions: ['EMBED_LINKS'],
      guildOnly: true
    });
  }

  run(msg) {
    return msg.embed({
      color: this.client.colors.bot,
      author: {
        name: msg.guild.name
      },
      image: {
        url: msg.guild.iconURL() ? msg.guild.iconURL() : '' 
      },
      fields: [
        {
          name: 'ID',
          value: msg.guild.id,
          inline: true
        },
        {
          name: 'Owner',
          value: msg.guild.owner.user.tag,
          inline: true
        },
        {
          name: 'Members',
          value: msg.guild.memberCount,
          inline: true
        },
        {
          name: 'Text Channels',
          value: msg.guild.channels.filter(channel => channel.type == 'text').size,
          inline: true
        },
        {
          name: 'Voice Channels',
          value: msg.guild.channels.filter(channel => channel.type == 'voice').size,
          inline: true
        },
        {
          name: 'Created at',
          value: moment(msg.guild.createdAt).format('DD-MM-YYYY HH:mm:ss'),
          inline: true
        },
        {
          name: 'Region',
          value: msg.guild.region,
          inline: true
        },
        {
          name: 'Roles',
          value: msg.guild.roles.size - 1,
          inline: true
        },
        {
          name: 'Features',
          value: msg.guild.features.join(', ') || '-',
          inline: true
        },
        {
          name: `Emojis(${msg.guild.emojis.size})`,
          value: msg.guild.emojis.map(e => [e.name + '<:' + e.name + ':' + e.id] + '>').splice(0, 10).join(' '),
          inline: true
        },
      ]
    });
  }
};
