const { Command } = require('discord.js-commando');
const db = require('../../Classes/SQLite').db;
const tags = db.import('../../Data/Models/Tags');
class AddTagCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'add-tag',
      memberName: 'add-tag',
      autoAliases: true,
      group: 'utils',
      description: 'Fetch a tag and return the description.',
      examples: ['add-tag tagname content', 'addtag rice rice is awesome'],
      args: [
        {
          key: 'name',
          prompt: 'What will be the name of the tag?\n',
          type: 'string'
        },
        {
          key: 'content',
          prompt: 'What content you want to add for this tag?\n',
          type: 'string',
          max: 2000
        }
      ]  
    });
  }

  async run(msg, { name, content }) {
    if(this.client.registry.commands.some(cmd => cmd.name === name))
      return msg.replyError('utils.add-tag.isCommand');
    if(!/^[\w]+/g.test(name))
      return msg.replyError('utils.tags.illegal');
    await tags.findOrCreate({
      where: {
        name,
        guild: msg.guild.id 
      },
      defaults: {
        description: content, 
        userid: msg.author.id
      }
    }).spread((tag, created) => {
      if(!created)
        return msg.replyError('utils.tags.exists', name);
      return msg.replyConfirm('utils.tags.sucess', name);
    });
  }
}

module.exports = AddTagCommand;