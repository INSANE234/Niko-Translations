const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
class CatFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cat-fact',
      memberName: 'cat-fact',
      aliases: ['cft'],
      group: 'search',
      description: 'Sends a random cat fact.',
      examples: ['catfact']
    });
  }
  async run(msg) {

    const { body, ok } = await get('https://catfact.ninja/fact');
    if(!ok) return null;
    const { fact } = body;
    return msg.embed({
      color: this.client.colors.ok,
      title: ':cat2: fact',
      description: fact
    });
  }
}

module.exports = CatFactCommand;