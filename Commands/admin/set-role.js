
const { Command } = require('discord.js-commando');
class SetRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set-role',
      memberName: 'set-role',
      aliases: ['sr', 'str'],
      group: 'admin',
      description: 'Add the specified role to the specified member.',
      examples: ['str [role] [member]'],
      guildOnly: true,
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      args: [
        {
          key: 'role',
          prompt: 'Role to add in the member',
          type: 'role'
        },
        {
          key: 'member',
          prompt: 'Member to add the role.',
          type: 'member'
        }
      ]
    });
  }
  async run(msg, { role, member }) {
    if(member.roles.has(role.id)) return msg.replyError('admin.set-role.noRole');
    if(!role.editable) return msg.replyError('admin.set-role.cannotAssign');
    await member.roles.add(role);
    return msg.replyConfirm('admin.set-role.success', member.user.tag);
  }
}

module.exports = SetRoleCommand;