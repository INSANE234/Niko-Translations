const { Command } = require('discord.js-commando');
class AddPatronCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'add-patron',
      group: 'owner',
      memberName: 'add-patron',
      description: 'Adds a user into bot patrons list.',
      examples: ['addpatr @user'],
      guildOnly: true,
      ownerOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'What user you want to add to patrons?\n',
          type: 'user'
        }
      ]
    });
  }
  async run(msg, { user }) {
    if(await this.client.patreon.set(user))
      return msg.replyConfirm('owner.add-patron.added');
    return msg.replyConfirm('owner.default.error');
  }
}

module.exports = AddPatronCommand;