const { Command } = require('discord.js-commando');
const { GOOGLE_API } = process.env;
const { post } = require('snekfetch');
module.exports = class ShortenCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shorten',
      group: 'utils',
      memberName: 'shorten',
      description: 'Shorten a url using the Google API',
      examples: ['shorten url'],
      args: [
        {
          key: 'url',
          prompt: 'Url to shorten',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { url }) {
    const { body } = await post(`https://www.googleapis.com/urlshortener/v1/url?key=${GOOGLE_API}`)
      .send({
        longUrl: url
      }).catch(() => {
        return msg.replyError('default.api.offline', 'Google Shortener ');
      });
    return msg.channel.sendOk(body.id);
  }
};
