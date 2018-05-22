const { Command } = require('discord.js-commando');
class RemovePatronCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-patron',
      group: 'owner',
      memberName: 'remove-patron',
      description: 'Removes a user from patron list.', 
      examples: ['remptr @user'],
      guildOnly: true,
      ownerOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'What user you want to remove from patrons?\n',
          type: 'user'
        }
      ]
    });
  }
  async run(msg, { user }) {
    if(await this.client.patreon.delete(user))
      return msg.replyConfirm('owner.remove-patron.removed');
    return msg.replyConfirm('owner.default.error');
  }
}

module.exports = RemovePatronCommand;