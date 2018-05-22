const { Command } = require('discord.js-commando');
class StopMoeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop-moe',
      memberName: 'stop-moe',
      aliases: ['stpm'],
      group: 'search',
      description: 'Stop the auto moe',
      examples: ['stpm'],
      clientPermissions: ['EMBED_LINKS'],
      guildOnly: true,
      ownerOnly: true
    });
  }

  run(msg) {
    const guilds = this.client.registry.resolveCommand('search:auto-moe').guilds;
    if(!guilds.has(msg.guild.id)) return null;
    const interval = guilds.get(msg.guild.id);
    this.client.clearInterval(interval);
    guilds.delete(msg.guild.id);
    msg.replyConfirm('search-no-moe-ok');
  }
}

module.exports = StopMoeCommand;