const { Command } = require('discord.js-commando');
const TicTacToe = require('../../Classes/Games/TicTacToe');
module.exports = class TicTacToeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tictactoe',
      memberName: 'tictactoe',
      aliases: ['ttt'],
      group: 'games',
      description: 'Play a nice Tic Tac Toe game with someone!',
      examples: ['ttt @user'],
      guildOnly: true,
      throttling: {
        usages: 5,
        duration: 10
      },
      argsCount: 1,
      argsPromptLimit: 3,
      args: [
        {
          key: 'participant',
          prompt: 'Who will be your adversary?\n',
          type: 'user',
          default: ''
        }
      ]
    });
    /**
     * @typedef {Object} Game
     * @property {TicTacToe} game
     * @property {Array<string>} starters
     */
    /**
     * @type {Map<string, Game>}
     */
    this.games = new Map();
  }
  async run(msg, { participant }) {
    if(!participant) {
      const TTT = this.games.get(msg.guild.id);
      if(!TTT.starters.includes(msg.author.id))
        return msg.replyError('games.ttt.notAllowed');
      TTT.game.stop();
      return msg.replyConfirm('games.ttt.stopped');
    }
    if(participant.bot || participant.id === msg.author.id || this.games.has(msg.guild.id))
      return;
    const participants = [msg.author, participant];
    try {
      const TTT = new TicTacToe(this.client, msg.channel, participants);
      await TTT.start();
      this.games.set(msg.guild.id, { game: TTT, starters: [msg.author.id, participant.id] });
      return null;
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
};