const { Command } = require('discord.js-commando');
const LevelService  = require('../../Classes/Services/LevelService');
const fs = require('fs-nextra');
module.exports = class BadgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'badge',
      group: 'owner',
      memberName: 'badge',
      description: 'Adds a badge into users profile.',
      examples: ['badge @user add 0', 'badge @user remove 0'],
      guildOnly: true,
      ownerOnly: true,
      args: [
        {
          key: 'action',
          prompt: 'You want to *add* or *remove* badges?\n',
          type: 'string',
          default: 'add',
          validate: action => {
            if(['add', 'remove'].includes(action.toLowerCase()))
              return true;
            return 'Action must be one of those types:  *add* or *remove*\n';
          },
          parse: action => action.toLowerCase()
        },
        {
          key: 'user',
          prompt: 'What user you want to add the badge\n',
          type: 'user'
        },
        {
          key: 'badge',
          prompt: 'Which badge you want to add?',
          type: 'integer',
          validate: badge => {
            if(badge > 2) 
              return 'You provided a invalid badge code!\n';
            return true;
          }
        }
      ]
    });
  }
  async run(msg, { action, user, badge }) {
    let badges = await fs.readJSON('./Data/badges.json');
    badge = badges.find(badge => badge.id === badge);
    const profile = await LevelService.getRow(user);
    badges = profile.badges;
    if(action === 'add') {
      if(badges.includes(badge))
        return msg.replyError('owner.badge.duplicated', badge);
      badges.push(badge);
      await profile.update({
        badges
      });
      return msg.replyConfirm('owner.badge.added', badge);
    } 
    else if(action === 'remove') {
      if(!badges.includes(badge))
        return msg.replyError('owner.badge.doNotHave');
      badges.splice(badges.indexOf(badge), 1);
      await profile.update({
        badges
      });
      return msg.replyConfirm('owner-badge-removed', badge);
    }
  }
};
