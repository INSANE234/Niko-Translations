const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
class MALCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mal',
      memberName: 'mal',
      group: 'search',
      description: 'Search for information about the especified user in my anime list.',
      examples: ['mal [user]'],
      ownerOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'What user you want to get info about?\n',
          type: 'string'
        }
      ]
    });
  }
  async run(msg, { user }) {
    const { body } = await snekfetch.get(`${process.env.API_URL}/lists/${user}`).catch(e => {
      if(!e.ok)
        return msg.replyError('default.api.offline', 'MAL');
      this.client.emit('error', e);
      return null;
    });
    let animes = '';
    for(const anime of body.favorites) 
      animes += `**${anime}**\n`;
    const embed = {
      color: this.client.colors.ok,
      author: {
        name: user,
        icon_url: body.about.profile_pic,
        url: `https://myanimelist.net/profile/${user}`
      },
      description: msg.guild.getKey('search.mal.topFavorite', animes),
      fields: [
        {
          name: msg.guild.getKey('search.mal.watching'),
          value: body.status.watching,
          inline: true
        },
        {
          name: msg.guild.getKey('search.mal.completed'),
          value: body.status.completed,
          inline: true
        },
        {
          name: 'Dropped',
          value: body.status.dropped,
          inline: true
        },
        {
          name: msg.guild.getKey('search.mal.planToWatch'),
          value: body.status.to_watch,
          inline: true
        },
        {
          name: msg.guild.getKey('search.mal.days'),
          value: body.dymn.days,
          inline: true
        },
        {
          name: msg.guild.getKey('search.mal.meanScore'),
          value: body.dymn.mean,
          inline: true
        },
        {
          name: msg.guild.getKey('search.mal.lastSeen'),
          value: body.about.last_seen,
          inline: true
        },
        {
          name: msg.guild.getKey('search.mal.gender'),
          value: body.about.gender,
          inline: true
        },
        {
          name: msg.guild.getKey('search.mal.birthday'),
          value: body.about.birthday,
          inline: true
        },
      ]
    };
    return msg.embed(embed);
  }
}

module.exports = MALCommand;