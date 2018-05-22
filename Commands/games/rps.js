const { Command } = require('discord.js-commando');
module.exports = class RPSCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rps',
      group: 'games',
      memberName: 'rps',
      description: 'Play Rock, Paper or scissors and try gain of me',
      examples: ['rps [choice] (rock, paper or scissors)', 'rps rock'],
      args: [
        {
          key: 'choice',
          prompt: 'What are your choice? (rock, paper or scissors)',
          type: 'string',
          validate: choice => {
            if(this.isValidResponse(choice)) return true;
            return `The choice must be one of the followings => ${this.choices.join(', ')}`;
          }
        }
      ]
    });
  }

  run(msg, { choice }) {
    const pick = this.getChoice(choice);
    let text;
    const nikoPick = Math.floor(Math.random() * 2);
    if(pick === nikoPick)
      text = msg.guild.getKey('games.rps.draw', this.getRpsPick(pick));
    else if((pick == 0 && nikoPick == 1) ||
        (pick == 1 && nikoPick == 2) ||
        (pick == 2 && nikoPick == 0))
      text = msg.guild.getKey('games.rps.lose', this.getRpsPick(nikoPick), this.getRpsPick(pick));
    else 
      text = msg.guild.getKey('game.rps.win', this.getRpsPick(pick), this.getRpsPick(nikoPick));
    return msg.channel.sendOk(text);

  }
  getRpsPick(p) {
    switch (p)
    {
      case 0:
        return '🚀';
      case 1:
        return '📎';
      default:
        return '✂️';
    }
  }
  isValidResponse(p) {
    return this.choices.includes(p);
  }
  get choices() {
    return [
      'r',
      'pedra',
      'rock',
      'rocket',
      'p',
      'papel',
      'paper',
      'paperclip',
      's',
      'tesoura',
      'scissors',
    ];
  }
  getChoice(choice) {
    switch (choice)
    {
      case 'r':
      case 'pedra': 
      case 'rock':
      case 'rocket':
        return 0;
      case 'p':
      case 'papel':
      case 'paper':
      case 'paperclip':
        return 1;
      case 'scissors':
      case 'tesoura':
      case 's':
        return 2;
      default:
        return 0;
    }
  }
};