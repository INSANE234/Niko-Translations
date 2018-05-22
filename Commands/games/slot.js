const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const Service = require('../../Classes/Services/LevelService');

module.exports = class SlotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slot',
      group: 'games',
      memberName: 'slot',
      description: 'Let\'s you play a round with the slot machine',
      details: stripIndents`
				Bet some amount of coins, and enjoy a round with the slot machine.
      `,
      examples: ['slot 30'],
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 10
      },
      args: [
        {
          key: 'bet',
          prompt: 'Your bet',
          type: 'integer',
          validate: bet => {
            if (bet > 1) return true;
            return 'Your bet must be greater than 1';
          }
        }
      ]
    });
  }

  async run(msg, { bet }) {
    try {
      const row = await Service.getRow(msg.author);
      if(row.coins < bet)
        return msg.replyError('games.default.notEnough');
  
      const roll = this.generateRoll();
      let winnings = 0;

      for(const combo of this.combinations) {
        if (roll[combo[0]] === roll[combo[1]] && roll[combo[1]] === roll[combo[2]]) {
          winnings += this.values[roll[combo[0]]];
        }
      }
      await row.decrement({ coins: bet });
      if (winnings === 0) {
        return msg.embed({
          color: 0xBE1931,
          description: stripIndents`
					**${msg.member.displayName}, ${msg.guild.getKey('games.slot.youRolled')}:**

					${this.showRoll(roll)}

					${msg.guild.getKey('games.slot.betterLuck')}
				`
        });
      }
      const calc = bet + winnings;
      await row.increment({ coins: calc });
      return msg.embed({
        color: 0x5C913B,
        description: stripIndents`
				**${msg.member.displayName}, ${msg.guild.getKey('games.slot.youRolled')}:**

				${this.showRoll(roll)}

				**${msg.guild.getKey('games.slot.congrats')}**
				${msg.guild.getKey('games.slot.win', calc)}
			`
			
      });
    } catch(e) {
      this.client.lemit('error', e);
      return null;
    }
  }
  get values() {
    return {
      '💎': 500,
      '⚜': 400,
      '💰': 400,
      '❤': 300,
      '⭐': 300,
      '🎲': 250,
      '🔅': 250,
      '🎉': 250,
      '🍒': 250
    };
  }
  get reels() {
    return [
      ['🍒', '💰', '⭐', '🎲', '💎', '❤', '⚜', '🔅', '🎉'],
      ['💎', '🔅', '❤', '🍒', '🎉', '⚜', '🎲', '⭐', '💰'],
      ['❤', '🎲', '💎', '⭐', '⚜', '🍒', '💰', '🎉', '🔅']
    ];
  }
  get combinations() {
    return [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [1, 2, 4]];
  }
  generateRoll() {
    const roll = [];

    this.reels.forEach((reel, index) => {
      const rand = Math.floor(Math.random() * reel.length);
      roll[index] = rand === 0 ? reel[reel.length - 1] : reel[rand - 1];
      roll[index + 3] = reel[rand];
      roll[index + 6] = rand === reel.length - 1 ? reel[0] : reel[rand + 1];
    });
  
    return roll;
  }
  showRoll(roll) {
    return stripIndents`
    ◻⬛: ⬛ :⬛◻
   ▶${roll[3]}: ${roll[4]} :${roll[5]}◀
    ◻⬛: ⬛ :⬛◻
 `;
  }
};