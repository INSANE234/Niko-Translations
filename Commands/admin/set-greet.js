const { Command } = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
module.exports = class SetGreetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set-greet',
      memberName: 'set-greet',
      aliases: ['stg', 'setgreet', 'greet'],
      group: 'admin',
      description: 'Set\'s the guild greet message(don\'t forgot the **quotes** around the message)',
      details: oneLine`You can use the following global variables => **$user**(Display the user as mention), 
      **$server**(Display the server name) and **$id**(Display the user's id)`,
      examples: ['stg \'Message\' #channel(optional)', 'stg "Welcome $user to $server!" general'],
      guildOnly: true,
      userPermissions: ['MANAGE_GUILD'],
      argsSingleQuotes: true,
      argsPromptLimit: 3,
      args: [
        {
          key: 'message',
          prompt: 'What\'ll be the welcome message?\n',
          type: 'string',
          default: ''
        },
        {
          key: 'channel',
          prompt: 'What channel i\'ll send the welcome messages?\n',
          type: 'channel',
          default: msg => {
            return msg.channel;
          }
        }
      ]
    });
  }

  async run(msg, { message, channel }) {
    try {
      const all = {};
      all.channel = message ? channel.id : null;
      await this.client.provider.set(msg.guild, 'greet',  all);
      if(!message) return msg.confirmLocalized('admin.greet.off');
      all.message = message;
      await this.client.provider.set(msg.guild, 'greet', all);
      return msg.confirmLocalized('admin.greet.set', message);
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
};