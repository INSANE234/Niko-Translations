const { Command, util } = require('discord.js-commando');
const db = require('../../Classes/SQLite').db;
const tags = db.import('../../Data/Models/Tags');
const { Op } = require('sequelize');
class ListTagsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-tags',
      memberName: 'list-tags',
      autoAliases: true,
      group: 'utils',
      description: 'Fetch  all tags created in this guild.',
      examples: ['listtags page', 'listtags 2'],
      args: [
        {
          key: 'page',
          prompt: 'Which page you want to see?\n',
          type: 'integer',
          default: 1
        }
      ]  
    });
  }

  async run(msg, { page }) {
    const allTags = await tags.findAll({
      where: {
        guild: { [Op.eq]: msg.guild.id }
      }
    });
    if(!allTags.length) 
      return msg.replyError('utils.list-tags.empty');
    let paginated = util.paginate(allTags, page, 10);
    if(page > paginated.maxPage) {
      page = paginated.maxPage;
      paginated = util.paginate(allTags, page, 10);
    }
    return msg.embed({
      color: this.client.colors.ok,
      author: {
        name: `${msg.guild.name}'s tags`,
        icon_url: msg.guild.iconURL() 
      },
      description: paginated.items.map(t => `• **${t.name}: ${t.description.substring(0, 30)}**`).join('\n'),
      footer: {
        text: msg.getKey('default.page.number', page, paginated.maxPage)
      }
    });
  }
}

module.exports = ListTagsCommand;