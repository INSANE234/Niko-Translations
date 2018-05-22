const { Command } = require('discord.js-commando');
const { Collection } = require('discord.js');
class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      group: 'admin',
      memberName: 'purge',
      description: 'Purges X amount of messages.',
      examples: ['purge 100', 'purge 100 bot', 'purge 100 @user'],
      guildOnly: true,
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      throttling: {
        usages: 1,
        duration: 20
      },
      args: [
        {
          key: 'value',
          prompt: 'Messages to delete',
          type: 'integer',
          max: 99,
          min: 1,
          default: 2
        },
        {
          key: 'type',
          prompt: 'What\'s the type of this bulk?\n',
          type: 'string|user',
          parse: type => typeof type === 'string' ? type.toLowerCase() : null,
          validate: (type, msg) => {
            if(type.match(/^(bot|command|me|all)/) || msg.mentions.users.first()) return true;
            return 'The type must be one of those => bot, command, me, all';
          },
          default: 'all'
        }
      ]
    });
  }

  async run(msg, { value, type }) {
    let messages = await msg.channel.messages.fetch({ limit: value + 1 });
    if(msg.mentions.users.first()) 
      messages = messages.filter(m => m.author.id === msg.mentions.users.first().id);
    if(type === 'bot')  
      messages = messages.filter(m => m.author.bot);
    
    if(type === 'command') 
      messages = messages.filter(m => m.content.startsWith(msg.guild.commandPrefix));
    
    if(type === 'me') 
      messages =  messages.filter(m => m.author.id === msg.author.id);
    
    const authors = new Collection();
    for(const m of messages.values()) {
      if(!authors.has(m.author.id)) 
        authors.set(m.author.id, m.author);
    }
    await msg.channel.bulkDelete(messages, true);
    const message = await msg.embed({
      title: 'Prune Results',
      color: this.client.colors.ok,
      fields: [
        {
          name: msg.guild.getKey('admin.purge.total'),
          value: `\`\`\`prolog
${messages.size}
\`\`\``
        },
        {
          name: msg.guild.getKey('admin.purge.byUsers'),
          value: `\`\`\`prolog
${authors.map(u => u.tag).join('\n')}
\`\`\``
        }
      ]
    });
    return message.delete({ timeout: 5000 }).catch(() => {});
  }
}

module.exports = PurgeCommand;