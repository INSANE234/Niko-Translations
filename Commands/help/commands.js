const { Command } = require('discord.js-commando');
module.exports = class Commands extends Command {
  constructor(client) {
    super(client, {
      name: 'commands',
      group: 'help',
      aliases: ['cmds'],
      memberName: 'commands',
      description: 'Displays a list of available commands',
      examples: ['cmds'],
      guarded: true
    });
  }

  async run(msg) {
    const groups = this.client.registry.groups.filter(grp => grp.commands.some(cmd => cmd.isUsable(msg) && cmd.isEnabledIn(msg.guild)));
    const embed = {
      color: this.client.colors.bot,
      description: msg.getKey('help.commands.commandList'),
      fields: []
    };
    groups.map(g => {
      embed.fields.push({
        name: g.name,
        value: g.commands.filter(cmd => cmd.isUsable(msg) && cmd.isEnabledIn(msg.guild)).map(cmd => `${this.prefix(msg)}${cmd.name}`).join('\n'),
        inline: true
      });
    });
    return msg.embed(embed).catch(() => {
      msg.direct({ embed }).catch(() => {});
    });
  }
  prefix(msg) {
    return msg.guild.commandPrefix;
  }
};
