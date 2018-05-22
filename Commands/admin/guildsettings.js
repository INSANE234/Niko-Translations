const { Command } = require('discord.js-commando');
module.exports = class GuildSettings extends Command {
  constructor(client) {
    super(client, {
      name: 'guildsettings',
      aliases: ['gset'],
      group: 'admin',
      memberName: 'guildsettings',
      description: 'Show your guild settings',
      examples: ['gset'],
      guildOnly: true
    });
  }
  async run(msg) {
    const infos = await msg.guild.getSettings();
    if(!infos) return null;
    return msg.embed({
      color: 0x802bff,
      fields: [
        {
          name: 'Greet Channel',
          value: infos.greet.channel ? this.tryGet(infos.greet.channel) : 'none'
        },
        {
          name: 'Greet Message',
          value: infos.greet ? this.makeExample(msg, infos.greet.message) : 'none'
        },
        {
          name: 'Bye Channel',
          value: infos.bye && infos.bye.channel ? this.tryGet(infos.bye.channel) : 'none'
        },
        {
          name: 'Bye Message',
          value: infos.bye ? this.makeExample(msg, infos.bye.message) : 'none'
        },
      ],
      footer: {
        icon_url: msg.guild.iconURL() ? msg.guild.iconURL() : '',
        text: msg.guild.name
      }
    });
  }
  makeExample(msg, text) {
    const replaces = {
      '$user': msg.author,
      '$server': msg.guild.name,
      '$id': msg.author.id
    };
    return text.replace(/$user|$server|$id|$channel/gi, matched => {
      return replaces[matched];
    });
  }
  tryGet(id) {
    const ch1 = this.client.channels.get(id);
    return ch1 ? ch1.name : 'none';
  }
};
