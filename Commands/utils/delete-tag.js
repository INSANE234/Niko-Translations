const { Command } = require('discord.js-commando');
const db = require('../../Classes/SQLite').db;
const tags = db.import('../../Data/Models/Tags');
const { Op } = require('sequelize');
class DelTagCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delete-tag',
      memberName: 'delete-tag',
      autoAliases: true,
      aliases: ['deltag'],
      group: 'utils',
      description: 'Fetch a tag and then delete if exists.',
      examples: ['deltag tagname', 'deltag rice'],
      args: [
        {
          key: 'name',
          prompt: 'Which tag you want to delete?\n',
          type: 'string'
        }
      ]  
    });
  }

  async run(msg, { name }) {
    const administrator = msg.member.permissions.has('ADMINISTRATOR');
    const tag = await tags.findOne({
      where: {
        name: { [Op.eq]:  name.toLowerCase() },
        guild: { [Op.eq]: msg.guild.id }
      }
    });
    if(!tag) 
      return msg.replyError('utils.tag.default.notExists');
    if(msg.author.id !== tag.userid && !this.client.isOwner(msg.author) || !administrator)
      return msg.replyError('utils.tag.default.noPermission"');
    await tag.destroy();
    return msg.replyConfirm('utils.delete-tag.success');
  }
}

module.exports = DelTagCommand;