const { oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const { disambiguation } = require('discord.js');
module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      group: 'help',
      memberName: 'help',
      aliases: ['h'],
      description: 'Displays a list of available commands, or detailed information for a specified command.',
      details: oneLine`
      This command will show a help for the specified command, if it doesn't exist
      it will show the help text.
			`,
      examples: ['h', 'help [Command]'],
      guarded: true,
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to view the help for?',
          type: 'string',
          default: ''
        }
      ]
    });
  }

  async run(msg, { command }) { // eslint-disable-line complexity
    const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
    if(command) {
      const commands = this.client.registry.findCommands(command, false, msg);
      if(commands.length) {
        const cmd = commands[0];
        if(cmd.ownerOnly && !this.client.isOwner(msg.author)) return null;
        let examples = '';
        const details = cmd.details;
        if(cmd.examples) {
          for(const example of cmd.examples)
            examples += `${prefix}${example}\n`;
        }
        if(cmd.aliases && cmd.autoAliases) 
          cmd.aliases.push(cmd.name.replace('-', ''));
        const embed = {
          color: this.client.colors.bot,
          author: {
            name: `${cmd.name}  ${cmd.aliases ? `/ ${cmd.aliases} ` : 'none'}`,
            icon_url: this.client.user.displayAvatarURL()
          },
          description: `${cmd.description} ${this.getCommandRequirements(cmd, msg)}`,
          fields: [
            {
              name: msg.getKey('help.command-usage'),
              value: this.usage(msg, `${cmd.name} ${cmd.format ? cmd.format : ''}`)
            }
          ],
          footer: {
            text: cmd.group.name
          }
        };
        if(details)
          embed.fields.push({
            name: msg.getKey('help.command.details'),
            value: details
          });
        if(examples)
          embed.fields.push({
            name: msg.getKey('help.command.examples'),
            value: examples
          });
        return msg.embed(embed);
      } else if(commands.length > 1) {
        return msg.reply(disambiguation(commands, 'commands'));
      } else {
        return msg.reply(
          `Unable to identify command. Use ${msg.usage(
            null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
          )} to view the list of all commands.`
        );
      }
    } else {
      const embed = {
        color: this.client.colors.bot,
        title: 'Invite',
        fields: [
          {
            name: 'Commands',
            value: `To see the list of commands type ${prefix}cmds`
          },
          {
            name: 'Add me in your server :3',
            value: oneLine`[💙](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=379904 "Default permissions")\n
            [<:hammer:443824201019949067>](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=403041302 "Admin Permissions")`
          },
          {
            name: `Join into ${this.client.user.username} Support Server ❤ you can gain nice badges in there`,
            value: '[🚪⬅](https://discord.gg/XfGCfS7)'
          },
          {
            name: 'If you like me, please consider make a donation',
            value: '[❤ Patreon](https://www.patreon.com/nikobot "Patreon")'
          },
        ],
        timestamp: new Date()
      };
      msg.channel.send({embed}).catch(() => {});
    }	
  }
  getCommandRequirements(com, msg) {
    const clientPermissions = com.clientPermissions ? com.clientPermissions.join(', ') : '';
    // const userPermissions = com.userPermissions ? com.userPermissions.join(', ') : '';
    if(clientPermissions) 
      return msg.getKey('help.server.permissions', clientPermissions.replace('_', ''));
    return '';
  }   
  usage(msg, command,  prefix = this.client.commandPrefix) {
    prefix = msg.guild && msg.guild.commandPrefix ? msg.guild.commandPrefix : prefix; 
    const nbcmd = command.replace(/ /g, '\xa0');
    prefix = prefix.replace(/ /g, '\xa0');
    const prefixPart = `\`${prefix}${nbcmd}\``;
    
    return `${prefixPart || ''}`;
  }
};
