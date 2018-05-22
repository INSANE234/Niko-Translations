const { Command, util } = require('discord.js-commando');
const db = require('../../Classes/SQLite').db;
const streams = db.import('../../Data/Models/Streams');
const { Op } = require('sequelize');
module.exports = class ListStreamsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-streams',
      memberName: 'list-streams',
      aliases: ['lstrms'],
      autoAliases: true,
      group: 'utils',
      description: 'Lists the streams which kanade is tracking in this guild',
      examples: ['lstrms', 'lstrms page', 'lstrms 2'],
      guildOnly: true,
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
      const rows = await streams.findAll({ where: { guildid: { [Op.eq]: msg.guild.id } } });
      if(rows.length < 1) 
        return msg.replyError('utils.list-streams.empty', msg.guild.commandPrefix || this.client.commandPrefix);
      const paginated = util.paginate(rows, page, 10);
      return msg.embed({
        color: 0x802bff,
        author: {
          name: msg.guild.name,
          icon_url: msg.guild.iconURL() ? msg.guild.iconURL() : ''
        },
        title: msg.guild.getKey('utils.list-streams.beingTracked'),
        description: paginated.items.map(stream => `• ** ${stream.username}**`).join('\n'),
        footer: {
          text: msg.guild.getKey('default.page.number', page, paginated.maxPage)
        }
      });
    } catch(e) {
      this.client.logger.error(e.stack);
      return null;
    }
  }
};
