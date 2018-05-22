const { Command } = require('discord.js-commando');
const { GIPHYAPIKEY } = process.env;
const { get }= require('snekfetch');
class GiphyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'giphy',
      memberName: 'giphy',
      aliases: ['gpy'],
      group: 'search',
      description: 'Sends a random gif with specified tags',
      examples: ['gpy <tags>'],
      clientPermissions: ['EMBED_LINKS'],
      argsPromptLimit: 3,
      args: [
        {
          key: 'tags',
          prompt: 'What tags you want to search?',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { tags }) {
    const offset = Math.floor((Math.random() * 4) + 1);
    const { body, ok } = await get(`http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(tags)}&api_key=${GIPHYAPIKEY}&limit=30&offset=${offset}`);
    if(!ok) return null;
    const { data } = body;
    if(!data.length) 
      return msg.channel.sendError(msg.guild.getKey('search.default.notFound"'));
       
    const gif = data.randomItem().images.original.url;
    return msg.channel.sendOk(`**${msg.author.tag}** => ${gif}`);
  }
}

module.exports = GiphyCommand;