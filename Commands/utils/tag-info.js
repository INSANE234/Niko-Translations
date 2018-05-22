const { Command } = require('discord.js-commando');
const db = require('../../Classes/SQLite').db;
const tags = db.import('../../Data/Models/Tags');
const moment = require('moment');
class TagInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tag-info',
      memberName: 'tag-info',
      autoAliases: true,
      group: 'utils',
      description: 'Fetch a tag and return some informations.',
      examples: ['taginfo tagname', 'taginfo rice'],
      args: [
        {
          key: 'name',
          prompt: 'Which tag you want to get information about?\n',
          type: 'string'
        }
      ]  
    });
  }

  async run(msg, { name }) {
    const tag = await tags.findOne({
      where: {
        name,
        guild: msg.guild.id
      }
    });
    if(!tag) 
      return msg.replyError('utils.tag.default.notExists');
    const member = await msg.guild.members.fetch(tag.userid);
    return msg.embed({
      color: this.client.colors.ok,
      author: {
        name: tag.name,
        icon_url: msg.guild.iconURL()
      },
      fields: [
        {
          name: msg.guild.getKey('utils.tag-info.author'),
          value: member.user.tag
        },
        {
          name: msg.guild.getKey('utils.tag-info.uses'),
          value: tag.usage_count
        },
        {
          name: msg.guild.getKey('utils.tag-info.createdAt'),
          value: moment(tag.createdAt).format('MM-DD-YYYY HH:mm:ss')
        },
        {
          name: msg.guild.getKey('utils.tag-info.modifiedAt'),
          value: moment(tag.updatedAt).format('MM-DD-YYYY HH:mm:ss')
        }         
      ]
    });
  }
}

module.exports = TagInfoCommand;