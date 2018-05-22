const { Command, util } = require('discord.js-commando');
const db = require('../../Classes/SQLite').db;
const profiles = db.import('../../Data/Models/Level/Profiles');
const guilds = new Map();
const moment = require('moment');
require('moment-duration-format');
const timeout = (60 * 1000) * 15;
class GlobalRankCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'globalrank',
      group: 'level',
      aliases: ['gr'],
      memberName: 'globalrank',
      description: 'Sends the bot global rank.',
      examples: ['gr '],
      guildOnly: true,
      ownerOnly: true,
      args: [
        {
          key: 'page',
          prompt: 'What page you want to see?\n',
          type: 'integer',
          default: 1
        }
      ]
    });
    this.cache = [];
    this.lastUsed = null;
  }

  async run(msg, { page }) {
    try{

      if(guilds.has(msg.guild.id)) return msg.replyError('level.global-rank.wait');
      const m = await msg.say(msg.guild.getKey('level.global-rank.generating'), {
        code: 'html'
      });
      const embed = {
        color: this.client.colors.bot,
        title: `🌎 ${this.client.user.username} Global Rank`,
        footer: {}
      };
      let ranks = '';
      let rows;
      if(!this.cache.length) {
        rows = await profiles.findAll({
          attributes: ['userId', 'xp', 'level', 'coins'],
          order: [
            ['level', 'DESC']
          ]
        });
        this.cache.push(...rows);
        setTimeout(() => { this.cache = []; this.lastUsed = null; }, timeout);
        this.lastUsed = Date.now() + timeout;
      } else {
        rows = this.cache;
      }
      let i = 0;
      const paginated = util.paginate(rows, page, 10);
      if(paginated.length <= 0)
        return msg.replyError('level.guild.rankEmpty');
      for(const c of paginated.items) {
        const user = await this.client.users.fetch(c.userId, true);
        i = rows.findIndex(r => r.userId === user.id);
        if(user.bot)
          await this.delete(c.userId);
        ranks += `${this.emoji(i + 1)} - **${this.replaceTag(user.tag)}** *(Level: ${c.level} XP: ${c.xp} Coins: ${c.coins})*\n\n`;
      }
      embed.description = ranks;
      if(this.lastUsed) 
        embed.footer.text = msg.guild.getKey('level.global-rank.resetsIn', moment.duration(this.lastUsed - Date.now()).format('mm:ss'));
      if(!this.client.isOwner(msg.author))
        this.recent(msg);
      return m.edit({ embed });
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  } 
  replaceTag(name) {
    return name.slice(0, name.indexOf('#') + 3);
  }
  recent(msg) {
    guilds.set(msg.guild.id, {
      timeout: this.client.setTimeout(() => {
        guilds.delete(msg.guild.id);
      }, 60 * 1000)
    });
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
  async delete(id) {
    await profiles.destroy({
      where: {
        userId: { [db.Sequelize.Op.eq]: id }
      }
    });
    return true;
  }
}

module.exports = GlobalRankCommand;