
const { Command } = require('discord.js-commando');
const translate = require('google-translate-api');
module.exports = class Translate extends Command {
  constructor(client) {
    super(client, {
      name: 'translate',
      aliases: ['trnsl'],
      group: 'utils',
      memberName: 'translate',
      description: 'Translates a text',
      guildOnly: true,
      argsPromptLimit: 3,
      examples: ['translate en pt How are you?'],
      args: [
        {
          key: 'from',
          prompt: 'What\'s is the language of that text?\n',
          type: 'string',
          parse: from => from.toLowerCase()
        },
        {
          key: 'to',
          prompt: 'For what language you want to translate?\n',
          type: 'string',
          parse: to => to.toLowerCase()
        },
        {
          key: 'text',
          prompt: 'What text you want to translate?\n',
          type: 'string'
        }]
    });
  }
  async run(msg, { text, from, to }) {
    const res = await translate(text, { from, to }).catch(() => {
      return msg.replyError('utils.translate.fail');
    });
    return msg.channel.sendOk(`**${from}** => **${to}**\n${res.text}`);
  }
};