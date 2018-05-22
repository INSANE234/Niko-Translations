const { Command } = require('discord.js-commando');
const db = require('../../Classes/SQLite').db;
const tags = db.import('../../Data/Models/Tags');
const { Op } = require('sequelize');
class TagCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tag',
      memberName: 'tag',
      group: 'utils',
      description: 'Fetch a tag and return the description.',
      examples: ['tag tagname', 'tag rice'],
      args: [
        {
          key: 'name',
          prompt: 'Which tag you want to see?\n',
          type: 'string'
        }
      ]  
    });
  }

  async run(msg, { name }) {
    const tag = await tags.findOne({
      where: {
        name,
        guild: { [Op.eq]: msg.guild.id }
      }
    });
    if(!tag) 
      return null;
    await tag.increment({ usage_count: 1});
    return msg.say(tag.get('description'));
  }
}

module.exports = TagCommand;