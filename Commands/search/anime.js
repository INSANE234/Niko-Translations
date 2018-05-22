const { Command } = require('discord.js-commando');
const Kitsu = require('kitsu-api-wrapper');
class AnimeSearchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'anime',
      memberName: 'anime',
      group: 'search',
      description: 'Search for information about the especified anime.',
      examples: ['anime Nagi no Asukara'],
      args: [
        {
          key: 'query',
          prompt: 'Which anime you want to get information about?\n',
          type: 'string',
          parse: query => query.toLowerCase()
        }
      ]
    });
  }
  async run(msg, { query }) {
    const anime = await Kitsu.getAnime(query).catch(() => {
      return msg.replyError('search.anime.notFound');
    });
    if(!anime)
      return msg.replyError('search.anime.notFound');
    const embed = {
      color: this.client.colors.ok,
      title: anime.title,
      description: anime.synopsis,
      image: {
        url: anime.image,
      },
      fields: [
        {
          name: msg.guild.getKey('search.anime.episodes'),
          value: anime.episodeCount ? anime.episodeCount : 'Unknown',
          inline: true
        },
        {
          name: 'Status',
          value: anime.status,
          inline: true
        },
        {
          name: msg.guild.getKey('search.default.genres'),
          value: anime.genres.join('\n'),
          inline: true
        },
      ],
      footer: {
        text: `${msg.guild.getKey('search.default.score')}: ${anime.score} / 100`
      }
    };
    return msg.embed(embed);
  }
}

module.exports = AnimeSearchCommand;