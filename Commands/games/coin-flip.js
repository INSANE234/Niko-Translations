const { Command } = require('discord.js-commando');
const { join } = require('path');
const Service = require('../../Classes/Services/LevelService');
class CoinFlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coin-flip',
      group: 'games',
      memberName: 'coin-flip',
      aliases: ['cf'],
      description: 'Flip a coin and test your luck',
      examples: ['cf  [bet] [choice] (head or tail)', 'cf 20 head'],
      clientPermissions: ['ATTACH_FILES'],
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 10
      },
      argsCount: 2,
      argsPromptLimit: 3,
      args: [
        {
          key: 'bet',
          prompt: 'What is your bet?\n',
          type: 'integer'
        },
        {
          key: 'choice',
          prompt: 'What is your choice? (head or tail)\n',
          type: 'string',
          parse: choice => choice.toLowerCase(),
          oneOf: ['head', 'tail']
        }
      ]
    });
  }

  async run(msg, { bet, choice }) {
    try {
      const row = await Service.getRow(msg.author);
      if(row.coins < bet)
        return msg.replyError('games.default.notEnough', bet);
      const head = Math.floor(Math.random() * 2) === 1;
      let flipped;
      if(head)
        flipped  = 'head';
      else 
        flipped = 'tail';
      await row.decrement({
        coins: bet
      });
      const coin = join(__dirname, '..', '..', 'Data', 'Images', 'coins', `${flipped}s.png`);
      if(flipped === choice) {
        await row.increment({
          coins: bet + 10
        });
        return msg.say(msg.guild.getKey('games.coin-flip.win'), { files: [{attachment: coin, name: 'coinflip.png' }]});
      } else {
        return msg.say(msg.guild.getKey('games.default.betterLuck'), { files: [{attachment: coin, name: 'coinflip.png' }]});
      }
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
}

module.exports = CoinFlipCommand;