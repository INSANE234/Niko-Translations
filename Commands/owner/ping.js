const { Command } = require('discord.js-commando');
class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'owner',
      memberName: 'ping',
      description: 'Ping the bot for connection test purpose',
      examples: ['ping'],
      ownerOnly: true
    });
  }

  async run(msg) {
    const message = await msg.say('Ping?');
    const embed = {
      color: this.client.colors.ok,
      description: `Pong! (took: ${message.createdTimestamp - msg.createdTimestamp}ms)`
    };
    return message.edit({ embed });
  }
}

module.exports = PingCommand;