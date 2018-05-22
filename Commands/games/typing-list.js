const { Command, util } = require('discord.js-commando');
const readJSON = require('fs-nextra').readJSON;
module.exports = class TypingList extends Command {
  constructor(client) {
    super(client, {
      name: 'typing-list',
      memberName: 'typing-list',
      aliases: ['tpl'],
      group: 'games',
      description: 'Show the list of typing articles(10 per page)',
      examples: ['tpl'],
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 5
      },
      argsCount: 1,
      args: [
        {
          key: 'page',
          prompt: 'What page you want to see?\n',
          type: 'integer',
          default: 1
        }
      ]
    });
  }
  async run(msg, { page }) {
    try {
      const articles = await readJSON( './Data/typing_articles.json', { encoding: 'utf8' });
      const paginated = util.paginate(articles, page, 10);
      let i = (page - 1) * 10;
      if(paginated.items.length < 2) 
        return msg.replyError('games.typing-list.empty');
      return msg.embed({
        color: 4387947,
        title: msg.guild.getKey('games.typing-list.list'),
        description: paginated.items.map(p => `#${i++} - ${p.text.substring(0, 50)}...`).join('\n'),
        footer: {
          text: msg.guild.getKey('default.page.number', page, paginated.maxPage)
        }
      });
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
};