const { Command } = require('discord.js-commando');
class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['echo'],
      group: 'utils',
      memberName: 'say',
      description: 'Re-sends the provided text.',
      examples: ['say Hi there!'],
      guildOnly: true,
      args: [
        {
          key: 'text',
          prompt: 'What text would you like the bot to say?',
          type: 'string',
          min: 1,
          max: 400
        }
      ]
    });
  }

  async run(msg, { text }) {
    if(msg.guild && msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) 
      msg.delete({ timeout: 1000 }).catch(() => {
        // ignored
      });
    return msg.embed({
      color: this.client.colors.bot,
      description: text
    });
  }
}

module.exports = SayCommand;