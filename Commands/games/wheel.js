const { Command } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
const Currency = require('../../Classes/Services/CurrencyService');
const WOF = require('../../Classes/Games/WheelOfFortune');
class WheelOfFortune extends Command {
  constructor(client) {
    super(client, {
      name: 'wheel',
      memberName: 'wheel',
      aliases: ['wof'],
      group: 'games',
      description: 'Try the Wheel of Fortune',
      examples: ['wof [bet]', 'wof 20'],
      guildOnly: true,
      throttling: {
        usages: 5,
        duration: 10
      },
      argsCount: 1,
      argsPromptLimit: 3,
      args: [
        {
          key: 'bet',
          prompt: 'What\'s your bet?\n',
          type: 'integer',
          validate: (bet, msg) => {
            if(bet > 10 || bet < 1000) return true;
            return msg.guild.getKey('games.wheel.invalid');
          }
        }
      ]
    });
  }
  async run(msg, { bet }) {
    try {
      if(bet > 5000)
        return msg.replyError('games.wheel.reduceBet');
      const row = await Service.getRow(msg.author);
      if(row.coins < bet) return msg.replyError('games.default.notEnough');
      await row.decrement({ coins: bet });
      const wof = new WOF();
      const amount = bet * wof.multiplier;
      if(amount >= 1) {
        await row.increment({ coins: Math.round(amount) });
        return msg.channel.sendOk(`**${msg.author.tag} won: ${Math.round(amount) + Currency.emote}
      『${wof.multipliers[1]}』   『${wof.multipliers[0]}』   『${wof.multipliers[7]}』
   『${wof.multipliers[2]}』      ${wof.emoji}      『${wof.multipliers[6]}』
        『${wof.multipliers[3]}』   『${wof.multipliers[4]}』   『${wof.multipliers[5]}』**`);
      }
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
}

module.exports = WheelOfFortune;