const { Command } = require('discord.js-commando');
const Trivia = require('../../Classes/Games/Trivia/Trivia');
const { Role } = require('discord.js');
module.exports = class TriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trivia',
      memberName: 'trivia',
      group: 'games',
      description: 'Play trivia and test your knowledgement!',
      examples: ['trivia', 'trivia stop'],
      guildOnly: true,
      throttling: {
        usages: 5,
        duration: 10
      },
      argsCount: 1,
      argsPromptLimit: 3,
      args: [
        {
          key: 'flag',
          prompt: '...?\n',
          type: 'string',
          default: ''
        }
      ]
    });
    /**
     * @typedef {Object} Game
     * @property {Trivia} game
     * @property {string} starter
     */
    /**
     * @type {Map<string, Game>}
     */
    this.games = new Map();
  }
  async run(msg, { flag }) {
    if(flag && flag.toLowerCase() === 'stop') {
      if(!this.games.has(msg.guild.id))
        return msg.replyError('games.trivia.none');
      const Trivia = this.games.get(msg.guild.id);
      if(msg.author.id === Trivia.starter || this.canStop(msg, Trivia.starter)) {
        Trivia.game.stop();
        return msg.replyConfirm('games.trivia.stopped');
      }
      return msg.replyError('games.trivia.cannotStop');
    }
    if(this.games.has(msg.guild.id))
      return;
    try {
      const Game = new Trivia(this.client, msg);
      await Game.start();
      this.games.set(msg.guild.id, { game: Game, starter: msg.author.id });
      return null;
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
  async canStop(msg, starter) {
    const memberAuthor = msg.member || await msg.guild.members.fetch(msg.author.id);
    const memberStarter = await msg.guild.members.fetch(starter);
    if(memberAuthor.permissions.has('ADMINISTRATOR'))
      return true;
    if(Role.comparePositions(memberAuthor.highestRole, memberStarter.highestRole) >= 0)
      return true; 
    return false;
  }

};