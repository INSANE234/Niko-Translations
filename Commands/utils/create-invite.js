const { Command } = require('discord.js-commando');

class CreateInviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'create-invite',
      memberName: 'create-invite',
      group: 'utils',
      aliases: ['cri'],
      description: 'Creates a instant invite for this channel.',
      examples: ['cri'],
      clientPermissions: ['CREATE_INSTANT_INVITE'],
      userPermissions: ['CREATE_INSTANT_INVITE'],
      guildOnly: true,
      args: [
        {
          key: 'channel',
          prompt: '...',
          type: 'channel',
          default: msg => msg.channel,
          label: 'Channel to create the invite for.'
        }
      ]
    });
  }

  async run(msg, { channel }) {
    if(!channel.permissionsFor(this.client.user).has('CREATE_INSTANT_INVITE'))
      return null;
    const invite = await channel.createInvite({
      unique: false,
      maxAge: 86400
    });
    return msg.channel.sendOk(`Invite -> ${invite.url ? invite.url : invite.code}`);
  }
}

module.exports = CreateInviteCommand;