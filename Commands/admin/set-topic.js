const { Command } = require('discord.js-commando');
class SetTopicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set-topic',
      aliases: ['sttp'],
      group: 'admin',
      memberName: 'set-topic',
      description: 'Set\'s the topic of the context channel',
      examples: ['sttp [topic]'],
      userPermissions: ['MANAGE_CHANNELS'],
      clientPermissions: ['MANAGE_CHANNELS'],
      guildOnly: true,
      args: [
        {
          key: 'topic',
          prompt: 'Name of the new channel',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { topic }) {
    await msg.channel.setTopic(topic).catch(() => {
      return msg.replyError('admin.set-topic.noPermission');
    });
    return msg.replyConfirm('admin.set-topic.success');
  }
}

module.exports = SetTopicCommand;