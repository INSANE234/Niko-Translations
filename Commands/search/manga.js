const { Command } = require('discord.js-commando');
const Kitsu = require('kitsu-api-wrapper');
class MangaSearchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'manga',
      memberName: 'manga',
      group: 'search',
      description: 'Search for information about the especified manga.',
      examples: ['manga Nagi no Asukara'],
      args: [
        {
          key: 'query',
          prompt: 'Which manga you want to get information about?\n',
          type: 'string',
          parse: query => query.toLowerCase()
        }
      ]
    });
  }
  async run(msg, { query }) {
    const manga = await Kitsu.getManga(query).catch(() => {
      return msg.replyError('search.manga.notFound');
    });
    if(!manga)
      return msg.replyError('search.manga.notFound');
    const embed = {
      color: this.client.colors.ok,
      title: manga.title,
      description: manga.synopsis,
      image: {
        url: manga.image,
      },
      fields: [
        {
          name: msg.getKey('search.manga.chapters'),
          value: manga.chapterCount ? manga.chapterCount : 'Unknown',
          inline: true
        },
        {
          name: 'Status',
          value: manga.status,
          inline: true
        },
        {
          name: msg.getKey('search.manga.genres'),
          value: manga.genres.join('\n'),
          inline: true
        },
      ],
      footer: {
        text: `${msg.getKey('search.default.score')}: ${manga.score} / 100`
      }
    };
    return msg.embed(embed);
  }
}

module.exports = MangaSearchCommand;