const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
module.exports = class UrbanDictionaryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'urbandictionary',
      memberName: 'urbandictionary',
      aliases: ['urbdic'],
      group: 'search',
      description: 'Search for a word definition in urban dictionary',
      examples: ['urbdic [word]', 'urbdic hello'],
      guildOnly: true,
      clientPermissions: ['EMBED_LINKS'],
      argsPromptLimit: 3,
      args: [
        {
          key: 'query',
          prompt: 'What term you want to get information about?\n',
          type: 'string'
        }
      ]
    });
  }
  async run(msg, { query }) {
    const { body: items } = await get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`).catch(e => {
      if(!e.ok)
        return null;
    });
    const item = items.list[0];
    if(!item)
      return msg.replyError('search.urbandic.notFound');
    const word = item.word;
    const def = item.definition;
    const link = item.permalink;
    return msg.embed({
      color: this.client.colors.ok,
      author: {
        name: word,
        icon_url: 'http://i.imgur.com/nwERwQE.jpg'
      },
      url: link,
      description: def
    });
  }
};