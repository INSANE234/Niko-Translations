const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
module.exports = class CreateVoiceChannel extends Command {
  constructor(client) {
    super(client, {
      name: 'create-channel',
      aliases: ['crtch'],
      group: 'admin',
      memberName: 'create-channel',
      description: 'Create\'s a new channel in the guild',
      details: oneLine`Create's a new channel in this guild, you can also set an category for this 
      channel, just do !crtch [name] [category-name] **Do not include the []**`,
      examples: ['crtch [name]', 'crtch [name] [category-name]'],
      userPermissions: ['MANAGE_CHANNELS'],
      clientPermissions: ['MANAGE_CHANNELS'],
      guildOnly: true,
      args: [
        {
          key: 'name',
          prompt: 'What\'ll be the name of the new channel?\n',
          type: 'string',
          max: 20,
          min: 1
        },
        {
          key: 'type',
          prompt: 'What\'ll be the type of the new channel?\n',
          type: 'string',
          default: 'text',
          parse: type => type.toLowerCase(),
          oneOf: ['text', 'voice']
        },
        {
          key: 'category',
          prompt: 'What\'ll be the category of the new channel?\n',
          type: 'channel',
          default: ''
        }
      ]
    });
  }

  async run(msg, { name, type, category }) {
    const ch = await msg.guild.channels.create(name, {
      parent: category || null,
      type: type
    });
    return msg.replyConfirm('admin.create-channel.created', ch);
  }
};
