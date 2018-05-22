const { Command } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
module.exports = class DivorceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'divorce',
      group: 'level',
      memberName: 'divorce',
      description: 'Divorce with your love :/',
      examples: ['divorce @user'],
      clientPermissions: ['EMBED_LINKS'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Which user you want to divorce?\n',
          type: 'user',
          validate: (user, msg, arg) => {
            user = this.client.registry.types.get('user').parse(user, msg, arg);
            if(!user || user.bot || user.id === msg.author.id)
              return false;
            return true;
          },
        }
      ]
    });
  }

  async run(msg, { user }) {
    try {
      const d1r = await Service.getRow(msg.author);
      const d2r = await Service.getRow(user);
      if (d1r.married !== user.id) 
        return msg.replyError('level.divorce.wrongPerson');
      if (d1r.married === '...') 
        return msg.replyError('level.divorce.notMarried');
      if (d1r.coins < 2000) 
        return msg.replyError('level-divorce.notEnough');

      await d1r.update({ married: '...' });
      await d2r.update({ married: '...' });
      await d1r.decrement({ coins: 2000 });

      const embed = {
        color: this.client.colors.error,
        title: msg.guild.getKey('level.divorce.event'),
        description: msg.guild.getKey('level.divorce.description', msg.author, user),
        image: {
          url: user.displayAvatarURL()
        },
        thumbnail: {
          url: msg.author.displayAvatarURL()
        },
        timestamp: new Date()
      };
      return msg.embed(embed);
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
};
