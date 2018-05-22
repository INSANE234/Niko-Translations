const { Command } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
module.exports = class MarryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'marry',
      group: 'level',
      memberName: 'marry',
      description: 'Marry with a user',
      examples: ['marry @user'],
      clientPermissions: ['EMBED_LINKS'],
      guildOnly: true,
      argsCount: 1,
      argsPromptLimit: 3,
      throttling: {
        usages: 1,
        duration: 20
      },
      args: [
        {
          key: 'user',
          prompt: 'Which user do you want to marry?\n',
          type: 'user',
          validate: (user, msg, arg) => {
            user = this.client.registry.types.get('user').parse(user, msg, arg);
            if(!user || user.id === msg.author.id || user.bot)
              return false;
            return true;
          }
        }
      ]
    }); 
  } 

  async run(msg, { user }) {
    const m1r = await Service.getRow(msg.author);
    const m2r = await Service.getRow(user);
    if(!m1r || !m2r)
      return msg.replyError('level.marry.error');
    if (m1r.married !== '...') 
      return msg.replyError('level.marry.betray');
    if (m2r.married !== '...') 
      return msg.replyError('level.marry.married');      
    if (m1r.coins < 3000) 
      return msg.replyError('level.marry.notEnough');
    try {
      const message = await msg.channel.sendOk(msg.guild.getKey('level.marry.responseAlert', user.tag, msg.author.tag));
      const filter = m => m.author.id === user.id && m.content.toLowerCase().match(/sim|não|nao|yes|no|n|y|s/);
      const col = await msg.channel.awaitMessages(filter, {
        time: 60000,
        max: 1,
        errors: ['time']
      }).catch(() => {
        return message.edit(msg.guild.getKey('level.marry.noMessage', msg.author.tag, user.tag));
      });
      if(col.first().content.toLowerCase().match(/^não|nao|no|n/)) 
        return message.edit(msg.guild.getKey('level.marry.denied', msg.author.tag, user.tag));
      
      await m2r.update({ married: msg.author.id });
      await m1r.update({ married: user.id });
      await m1r.decrement({ coins: 3000 });
      return message.edit({ embed: {
        color: this.client.colors.bot,
        title: msg.guild.getKey('level.marry.event'),
        description: msg.guild.getKey('level.marry.congrats', msg.author.tag, user.tag),
        thumbnail: msg.author.displayAvatarURL(),
        image: user.displayAvatarURL(),
        timestamp: new Date()
      }
      });
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  } 
};
