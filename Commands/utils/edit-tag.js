const { Command } = require('discord.js-commando');
const { Op } = require('sequelize');
const db = require('../../Classes/SQLite').db;
const tags = db.import('../../Data/Models/Tags');
class EditTagCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'edit-tag',
      memberName: 'edit-tag',
      autoAliases: true,
      group: 'utils',
      description: 'Fetch a tag and then update the content.',
      examples: ['edittag tagname content', 'edittag rice rice is awesome'],
      args: [
        {
          key: 'name',
          prompt: 'Which tag you want to edit?\n',
          type: 'string'
        },
        {
          key: 'content',
          prompt: 'What will be the new content for this tag?\n',
          type: 'string'
        }
      ]  
    });
  }

  async run(msg, { name, content: description }) {
    const tag = await tags.findOne({
      where: {
        name: { [Op.eq]: name.toLowerCase() },
        guild: { [Op.eq]: msg.guild.id }
      }
    });
    if(!tag) 
      return msg.replyError('utils.tag.default.notExists');
    const administrator = msg.member.permissions.has('ADMINISTRATOR');
    if(msg.author.id !== tag.userid && !this.client.isOwner(msg.author) || !administrator)
      return msg.replyError('utils.tag.default.noPermission"');
    await tag.update({
      description
    });
    return msg.replyConfirm('utils.update-tag.success');
  }
}

module.exports = EditTagCommand;