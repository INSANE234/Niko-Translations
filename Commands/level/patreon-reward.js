const { Command } = require('discord.js-commando');
const Service = require('../../Classes/Services/PatreonService');
module.exports = class PatreonRewardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'patreon-reward',
      memberName: 'patreon-reward',
      aliases: ['parew'],
      group: 'level',
      description: 'Claim your patreon reward.',
      examples: ['parew']
    });
  }
  hasPermission(msg) {
    if(!this.client.patreon.patrons.get(msg.author.id))
      return false;
    return true;
  }
  async run(msg) {
    const { received, remaining } = await Service.getDaily(msg.author);
    if(received) 
      return msg.replyError('level-daily-remaining', remaining);
    await Service.receive(msg.author);
    return msg.channel.sendOk(msg.guild.getKey('level-daily-claimed', msg.author.tag));
  }
};
