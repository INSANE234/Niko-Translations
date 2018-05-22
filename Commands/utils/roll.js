const { Command } = require('discord.js-commando');
module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      group: 'utils',
      memberName: 'roll',
      description: 'Rolls a virtual dice',
      examples: ['roll'],
      args: [
        {
          key: 'value',
          prompt: 'What is the maximum number you wish to appear?',
          type: 'integer',
          default: 100,
          min: 1,
          max: 9999
        }
      ]
    });
  }

  run(msg, { value }) {
    const r = Math.floor(Math.random() * value) + 1;
    return msg.replyConfirm('utils.roll.rolled', r, value);
  }
};
