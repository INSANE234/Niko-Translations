const { Command } = require('discord.js-commando');

class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      memberName: 'avatar',
      group: 'utils',
      aliases: ['av'],
      description: 'Sends you avatar or the mentioned user avatar.',
      examples: ['av', 'av @user'],
      guildOnly: true,
      argsPromptLimit: 3,
      args: [
        {
          key: 'user',
          prompt: '...',
          type: 'user',
          default: msg => msg.author
        }
      ]
    });
  }

  run(msg, { user }) {
    return msg.embed({
      color: this.client.colors.ok,
      description: msg.guild.getKey('utils.avatar.forUser', user.tag),
      image: {
        url: user.displayAvatarURL({ format: 'png', size: 1024 })
      }
    });
  }
}

module.exports = AvatarCommand;