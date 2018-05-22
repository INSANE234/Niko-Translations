const { Command } = require('discord.js-commando');
const sherlock = require('sherlockjs');
const service = require('../../Classes/Services/ReminderService');
class RemindMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remindme',
      group: 'utils',
      memberName: 'remindme',
      description: 'Remind you of something',
      examples: ['remindme 1h of something'],
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'remind',
          label: 'reminder',
          prompt: 'what would you like me to remind you about?\n',
          type: 'string',
          validate: time => {
            const remindTime = sherlock.parse(time);
            if (!remindTime.startDate) 
              return 'please provide a valid starting time.';
            return true;
          },
          parse: time => sherlock.parse(time),
          default: ''
        }
      ]
    });
  }

  async run(msg, { remind }) {
    if(!remind) 
      await service.removeAll(msg);
    if(!await service.canCreate(msg.author.id)) 
      return null;
    if(!remind.eventTitle)
      remind.eventTitle = 'something';
    const { eventTitle: event } = remind;
    if(event.length > 500) return null; 
    const created = await service.create(msg, remind);
    if(!created) 
      return null;
    return created;
  }
}

module.exports = RemindMeCommand;