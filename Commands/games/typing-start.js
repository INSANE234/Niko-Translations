const { Command } = require('discord.js-commando');
const Typing = require('../../Classes/Games/Typing');
module.exports = class TypingStart extends Command {
  constructor(client) {
    super(client, {
      name: 'typing-start',
      memberName: 'typing-start',
      aliases: ['tps'],
      group: 'games',
      description: 'Starts a typing game in this channel',
      examples: ['tps'],
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 10
      }
    });
    this.typings = new Map();
  }
  async run(msg) {
    if(this.typings.has(msg.guild.id))
      return msg.replyError('games.typing-start.alreadyRunning');
    const game = new Typing(this.client, msg.channel);
    this.typings.set(msg.guild.id, { game, starter: msg.author.id });
    const started = await game.start();
    if(!started) {
      this.client.emit('error', '[TypingGame] An error occurred while starting a typing game');
      return msg.replyError('games.typing-start.error');
    }
    return null;
  }
};