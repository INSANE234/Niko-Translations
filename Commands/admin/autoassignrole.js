const { Command } = require('discord.js-commando');

class ASSRCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'autoassignrole',
      memberName: 'autoassignrole',
      aliases: ['assr'],
      group: 'admin',
      description: 'Activate the self assignable role in this server.',
      examples: ['assr @role'],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      guildOnly: true,
      argsPromptLimit: 3,
      args: [
        {
          key: 'role',
          prompt: 'Which role you want to be assigned to new members?\n',
          type: 'role',
          default: ''
        }
      ]
    });
  }

  async run(msg, { role }) {
    if(!role) 
      await msg.guild.settings.set('role', null);
    await msg.guild.settings.set('role', role.id);
    return msg.replyConfirm('admin.assr.ok', role.name);
  }
}

module.exports = ASSRCommand;