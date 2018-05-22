const { Command } = require('discord.js-commando');
module.exports = class CreateRole extends Command {
  constructor(client) {
    super(client, {
      name: 'create-role',
      aliases: ['cr'],
      group: 'admin',
      memberName: 'create-role',
      description: 'Create\'s a new role in the guild',
      examples: ['cr [name]', 'cr Super cool peoples -c #color'],
      format: 'role',
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      guildOnly: true,
      args: [
        {
          key: 'name',
          prompt: 'Name of the new role',
          type: 'string'
        }
      ]
    });
  }
  
  async run(msg, { name }) {
    const array = name.split(' ');
    let color;
    if(name.includes('-c'))
      color = array.indexOf('-c') + 1;
    else
      color = null;
    if(!array[color].match(/^.(?:[0-9a-fA-F]){5}/))
      color = null;
    const role = await msg.guild.roles.create({
      data: {
        name: color ? array.slice(0, color - 1).join(' ') : name,
        color: color && array[color] ? array[color] : null
      }
    }); 
    return msg.replyConfirm('admin.create-role.created', role.name);
  }
};
