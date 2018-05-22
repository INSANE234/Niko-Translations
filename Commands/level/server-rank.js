const { Command, util } = require('discord.js-commando');
const moment = require('moment');
const { db } = require('../../Classes/SQLite');
const profiles = db.import('../../Data/Models/Level/Profiles');
class ServerRankCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'server-rank',
      group: 'level',
      aliases: ['servrk'],
      memberName: 'server-rank',
      description: 'Sends the server rank for your server.',
      examples: ['servrk', 'servrk [page]'],
      guildOnly: true,
      ownerOnly: true,
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
    this.servers = new Map();
  }

  async run(msg, { page }) {
    if(this.servers.has(msg.guild.id)) {
      const time = this.servers.get(msg.guild.id).cooldown - Date.now();
      const timeLasting = moment.duration(time).format('mm:ss');
      return msg.replyError('commando.command.inCooldown', timeLasting);
    }
    let rows = await profiles.findAll({
      attributes: ['userId', 'xp', 'level', 'coins'],
      order: [
        ['level', 'DESC']
      ]
    });
    const embed = {
      color: this.client.colors.bot,
      author: {
        name: `${msg.guild.name} Rank`,
        icon_url: msg.guild.iconURL() ? msg.guild.iconURL() : ''
      }
    };
    try {
      const members = await msg.guild.members.fetch();
      rows = rows.filter(r => members.has(r.userId));
      const paginated = util.paginate(rows, page, 10);
      let ranks = '';
      let i = (page - 1) * 10;
      if(page > paginated.maxPage) 
        return msg.replyError('level.default.noItems');
      for(const c of paginated.items) {
        const user = await this.client.users.fetch(c.userId, true);
        if(user.bot)
          await this.client.registry.resolveCommand('level:globalrank').delete(c.userId);
        ranks += `${this.emoji(i += 1)} - **${user.tag}** *(Level: ${c.level} XP: ${c.xp} Coins: ${c.coins})*\n\n`;
      }
      embed.description = ranks;
      embed.footer = {
        text: msg.guild.getKey('default.page.number', page, paginated.maxPage)
      };
      this.servers.set(msg.guild.id, {
        timeout: setTimeout(() => {
          this.servers.delete(msg.guild.id);
        }, 30000),
        cooldown: Date.now() + 30000
      });
      return msg.embed(embed);
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  } 
  emoji(rank) {
    switch(rank) {
      case 1:
        return `🥇 ${rank}`;
      case 2:
        return `🥈 ${rank}`;
      case 3:
        return `🥉 ${rank}`;
      default:
        return `         ${rank}`;
    }
  }
}

module.exports = ServerRankCommand;