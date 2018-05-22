const { Command } = require('discord.js-commando');
module.exports = class RenameRole extends Command {
  constructor(client) {
    super(client, {
      name: 'rename-role',
      aliases: ['rr'],
      group: 'admin',
      memberName: 'rename-role',
      description: 'Rename the specified role',
      examples: ['rr [role] [new name]'],
      guildOnly: true,
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      args: [
        {
          key: 'role',
          prompt: 'What role you want to rename?\n',
          type: 'role'
        },
        {
          key: 'name',
          prompt: 'What will be the new name of that role?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { role, name }) {
    if(!role.editable) return msg.replyError('admin.rename-role.cannotEdit');
    if(role.name === name) return msg.replyError('admin.rename-role.sameName');
    await role.edit({ name });
    return msg.replyConfirm('admin.rename-role.newName');
  }
};
