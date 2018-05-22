const { Command } = require('discord.js-commando');
module.exports = class LennyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lenny',
      group: 'utils',
      memberName: 'lenny',
      description: '( ͡° ͜ʖ ͡°).',
      examples: ['lenny']
    });
  }

  async run(msg) {
    if (msg.guild && msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES'))
      await msg.delete(1000).catch(() => {});
    return msg.embed({
      color: this.client.colors.bot,
      description: '( ͡° ͜ʖ ͡°)'
    });
  }
};