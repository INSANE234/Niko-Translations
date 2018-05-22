const moment = require('moment');
const { Command } = require('discord.js-commando');
const fs = require('fs-nextra');
module.exports = class TypingAdd extends Command {
  constructor(client) {
    super(client, {
      name: 'typing-add',
      group: 'owner',
      aliases: ['tpadd'],
      memberName: 'typing-add',
      description: 'Add a new typing article into articles list.',
      examples: ['tpadd [text]'],
      ownerOnly: true,
      args: [
        {
          key: 'text',
          prompt: 'What\'s the text that you want to add in typing articles?\n',
          type: 'string',
          validate: text => {
            if(text.length < 250) return true;
            return 'You are trying to kill someone in this game? Text length must be below 250 characters!';
          }
        }
      ]
    });
  }

  async run(msg, { text }) {
    try {
      const json = await fs.readJSON('./Data/typing_articles.json', { encoding: 'utf8' });
      const t = text.sanitizeMentions();
      const article = { Title: `Text added on ${moment(Date.now()).format('DD-MM-YYYY HH:mm:ss')} by ${msg.author.tag}`, Text: t};
      json.push(article);
      await fs.writeJSON('./Data/typing_articles.json', json, { spaces: 5 });
      return msg.channel.sendOk(msg.getKey('owner.typing-add.added'));
    } catch(e) {
      this.client.logger.emit('error', e);
      return null;
    }
  }
};