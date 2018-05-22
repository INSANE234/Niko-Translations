const { Command, util } = require('discord.js-commando');
class ListServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-servers',
      memberName: 'list-servers',
      group: 'owner',
      aliases: ['ls'],
      description: 'List all servers where the bot is on.',
      guildOnly: true,
      ownerOnly: true,
      guarded: true,
      argsCount: 1,
      argsPromptLimit: 3,
      args: [
        {
          key: 'page',
          prompt: 'What\'s the page you want to see?\n',
          type: 'integer',
          default: 1
        }
      ]
    });
  }
  async run(msg, { page }) {
    try {
      const paginated =  util.paginate(this.client.guilds.map(g => g), page, 15);
      const client = this.client.user;
      if(!paginated.items) return null;
      return msg.embed({
        color: this.client.colors.bot,
        author: {
          name: `${client.username} Guilds`,
          icon_url: client.displayAvatarURL()
        },
        description: `This is the list of guilds where **${client.username}** is on\n${paginated.items.map(g => ` 
      ID: **${g.id}**
      ${msg.guild.getKey('owner.list-servers.name')}: **${g.name}**
      ${msg.guild.getKey('owner.list-servers.members')}: **${g.members.memberCount}**
      ${msg.guild.getKey('owner.list-servers.ownerId')}: **${g.owner.user.id}**`).join('\n')}`,
        footer: {
          text: msg.guild.getKey('default.page.number', page, paginated.maxPage)
        }
      });
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
}

module.exports = ListServersCommand;
