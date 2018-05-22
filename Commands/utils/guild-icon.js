const { Command } = require('discord.js-commando');

class GuildIconCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'guild-icon',
      memberName: 'guild-icon',
      group: 'utils',
      aliases: ['gldic'],
      description: 'Sends the server picture',
      examples: ['gldic'],
      guildOnly: true
    });
  }

  run(msg) {
    return msg.embed({
      color: this.client.colors.ok,
      image: {
        url: msg.guild.iconURL({ format: 'png', size: 1024 })
      }
    });
  }
}

module.exports = GuildIconCommand;