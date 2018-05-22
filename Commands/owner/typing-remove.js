const { Command } = require('discord.js-commando');
const fs = require('fs-nextra');
module.exports = class TypingRemove extends Command {
  constructor(client) {
    super(client, {
      name: 'typing-remove',
      memberName: 'typing-remove',
      aliases: ['tprm'],
      group: 'owner',
      description: 'Remove a entry from typing articles',
      examples: ['tprm [index]'],
      guildOnly: true,
      ownerOnly: true,
      args: [
        {
          key: 'index',
          prompt: 'What\'s the index of the article what you want to remove?\n',
          type: 'integer'    
        }
      ]
    });
  }

  async run(msg, { index }) {
    try {
      const json = await fs.readJSON('./Data/typing_articles.json', { encoding: 'utf8' });
      const removed = json[index];
      json.splice(index, 1);
      await fs.writeJSON('./Data/typing_articles.json', json, { spaces: 5 });
      return msg.channel.sendOk(msg.guild.getKey('owner.typing-remove.removed', index, removed.Text.substring(0, 50)));
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
};