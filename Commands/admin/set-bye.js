const { Command } = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
class ByeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set-bye',
      memberName: 'set-bye',
      aliases: ['stb', 'setbye', 'bye'],
      group: 'admin',
      description: 'Set\'s the guild bye message(don\'t forgot the **quotes** around the message)',
      details: oneLine`You can use the following global variables => **$user**(Display the user's username), 
      **$server**(Display the server name) and **$id**(Display the user's id)`,
      examples: ['stb \'Message\' #channel(optional)'],
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true,
      argsSingleQuotes: true,
      argsPromptLimit: 3,
      args: [
        {
          key: 'message',
          prompt: 'What\'ll be the goodbye message?\n',
          type: 'string',
          default: ''
        },
        {
          key: 'channel',
          prompt: '...',
          type: 'channel',
          default: msg => msg.channel
        }
      ]
    });
  }
  
  async run(msg, { message, channel }) {
    const all = {};
    all.channel = message ? channel.id : null;
    await this.client.provider.set(msg.guild, 'bye', all);
    if(!message)
      return msg.confirmLocalized('admin.bye.off');
    all.message = message;
    await this.client.provider.set(msg.guild,  'bye', all);
    return msg.confirmLocalized('admin.bye.set', message);
  }
}

module.exports = ByeCommand;