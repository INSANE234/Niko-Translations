const { Command } = require('discord.js-commando');
const { Op } = require('sequelize');
const db = require('../../Classes/SQLite').db;
const streams = db.import('../../Data/Models/Streams');
class RemoveStreamCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-stream',
      group: 'admin',
      aliases: ['rstr'],
      memberName: 'remove-stream',
      description: 'Stop tracking the provided stream.(Only Twitch)',
      examples: ['rstr [channel]'],
      guildOnly: true,
      userPermissions: ['MANAGE_GUILD'],
      argsCount: 1,
      argsPromptLimit: 3,
      args: [
        {
          key: 'stream',
          prompt: 'What stream channel you want to stop the tracking?\n',
          type: 'string'
        }
      ]
    });
  }
  
  async run(msg, { stream }) {
    try {
      const destroyed = await streams.destroy({
        where: {
          guildid: { [Op.eq]: msg.guild.id }, 
          username: { [Op.eq]: stream }
        }
      });
      if(destroyed < 1) 
        return msg.replyError('admin.remove-stream.notTracked');
      return msg.replyConfirm('admin.removes-stream.removed', stream);
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
}

module.exports = RemoveStreamCommand;