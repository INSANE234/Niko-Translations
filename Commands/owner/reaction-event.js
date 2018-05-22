const { Command } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
class ReactEventCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reaction-event',
      memberName: 'reaction-event',
      aliases: ['rctev'],
      group: 'owner',
      description: 'Starts a reaction event in that channel.',
      examples: ['rctev', 'rctev value', 'rctev 150'],
      ownerOnly: true,
      guildOnly: true,
      args: [
        {
          key: 'value',
          prompt: '...',
          type: 'integer',
          default: 100
        }
      ]
    });
  }

  async run(msg, { value }) {
    const { emoji } = this.client.configs.reaction;
    const embed = {
      color: this.client.colors.ok,
      title: msg.guild.getKey('owner.react-event.title'),
      description: msg.guild.getKey('owner-react-description', emoji, value),
      footer: {
        text: msg.guild.getKey('owner-react-time')
      }
    };
    const rewardedUsers = [];
    const m = await msg.say('@everyone', { 
      embed: embed,
      disableEveryone: false
    });
    const collector = m.createReactionCollector(
      (reaction) => reaction.emoji.name === emoji,
      { time: 60000 * (60 * 8) });
    this.listener = async message => {
      if(message.id === m.id) { 
        if(!collector.ended) {
          collector.stop('Message was deleted');
          const errm = await msg.channel.sendError(msg.guild.getKey('owner-reaction-deleted'));
          await errm.delete({ timeout: 5000 });
        }
      }
    };
    this.client.on('messageDelete', this.listener);
    
    collector.on('collect', async r => {
      for(const user of r.users.values()) {
        if(rewardedUsers.includes(user.id)) return;
        rewardedUsers.push(user.id);
        const row = await Service.getRow(user);
        await row.increment({ coins: value, xp: value });
      }
    });

    collector.on('end', (col, reason) => {
      this.client.logger.error(reason);
      if(!reason.includes('deleted'))
        m.delete({ timeout: 5000 }).catch(() => {}); 
      this.rewardedUsers = [];
      this.client.removeListener('messageDelete', this.listener);
    });
  }
}

module.exports = ReactEventCommand;