const { stripIndents, oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');

module.exports = class PrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      group: 'admin',
      memberName: 'prefix',
      description: 'Shows or sets the command prefix.',
      format: '[prefix/"default"/"none"]',
      details: oneLine`
				If no prefix is provided, the current prefix will be shown.
				If the prefix is "default", the prefix will be reset to the bot's default prefix.
				If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
				Only administrators may change the prefix.
			`,
      examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix default', 'prefix none'],

      args: [
        {
          key: 'prefix',
          prompt: 'What would you like to set the bot\'s prefix to?',
          type: 'string',
          max: 15,
          default: ''
        }
      ]
    });
  }

  async run(msg, args) {
    // Just output the prefix
    if(!args.prefix) {
      const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
      return msg.reply(stripIndents`
				${prefix ? msg.getKey('admin.prefix.prefixMessage', prefix) : msg.getKey('admin.prefix.noPrefix')}
				${msg.getKey('admin.prefix.runCommands', msg.anyUsage('command'))}
			`);
    }

    // Check the user's permission before changing anything
    if(msg.guild) {
      if(!msg.member.hasPermission('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
        return msg.replyError('admin.prefix.onlyAdmins');
      }
    } else if(!this.client.isOwner(msg.author)) {
      return msg.replyError('admin.prefix.onlyOwner');
    }

    // Save the prefix
    const lowercase = args.prefix.toLowerCase();
    const prefix = lowercase === 'none' ? '' : args.prefix;
    let response;
    if(lowercase === 'default') {
      if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
      const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : msg.getKey('admin.prefix.np');
      response = msg.getKey('admin.prefix.reset', current);
    } else {
      if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
      response = prefix ? msg.getKey('admin.prefix.set', args.prefix) : msg.getKey('admin.prefix.removed');
    }

    await msg.replyConfirm('admin.prefix.runCommands2', response, msg.anyUsage('command'));
    return null;
  }
};
