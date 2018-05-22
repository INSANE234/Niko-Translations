const { Command } = require('discord.js-commando');
module.exports = class TypingStop extends Command {
  constructor(client) {
    super(client, {
      name: 'typing-stop',
      memberName: 'typing-stop',
      aliases: ['tpst'],
      group: 'games',
      description: 'Stops the typing game in this channel',
      examples: ['tpst'],
      guildOnly: true
    });
  }
  run(msg) {
    const map = this.client.registry.resolveCommand('games:typingstart').typings;
    if(!map.has(msg.guild.id)) return msg.replyError('games.typing-stop.noGame');
    const guild = map.get(msg.guild.id);
    const canStop = () => {
      if(guild.starter === msg.author.id || msg.member.permissions.has('ADMINISTRATOR') 
      || this.client.isOwner(msg.author))
        return true;
      return false;
    };
    if(!canStop()) return null;
    const stopped = guild.game.stop();
    if(!stopped) {
      this.client.emit('error', `An error occurred when stopping a typing game for guild ${msg.guild.id}`);
      return msg.replyError('games.typing-stop.error');
    }
  }
};