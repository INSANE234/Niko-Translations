const { Command } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
module.exports = class TradeMoneyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trade-money',
      memberName: 'trade-money',
      aliases: ['t$', 'tm'],
      group: 'level',
      description: 'Trade a quantity of money with another user.',
      examples: ['tm @user amount', 'tm @user 3000'],
      guildOnly: true,
      argsPromptLimit: 3,
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'user',
          prompt: 'Which user you want to trade money?\n',
          type: 'user'
        },
        {
          key: 'q',
          prompt: 'What amount of money you want to trade?\n',
          type: 'integer'
        }
      ]
    });
  }
  async run(msg, { user, q }) {
    const user1 = await Service.getRow(msg.author);
    const user2 = await Service.getRow(user);
    if(user1.coins < q) 
      return msg.replyError('games.default.notEnough', q);
    await user1.decrement({ coins: q });
    await user2.increment({ coins: q });
    return msg.replyConfirm('level.trade-money.success', q, user.tag);
  }
};