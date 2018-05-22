const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
module.exports = class Kiss extends Command {
  constructor(client) {
    super(client, {
      name: 'kiss',
      group: 'actions',
      memberName: 'kiss',
      description: 'Kiss someone :3 (OR MAKE TWO PEOPLE KISS (╯°□°）╯︵ ┻━┻)',
      examples: ['kiss @user', 'kiss [username]', 'kiss @user1 @user2'],
      clientPermissions: ['EMBED_LINKS'],
      argsPromptLimit: 3,
      guildOnly: true,
      throttling: {
        usages: 5,
        duration: 7
      },
      args: [
        {
          key: 'user',
          prompt: 'What user you want to kiss?\n',
          type: 'user'
        },
        {
          key: 'user2',
          prompt: 'What user you want to make be kissed by the user 1?\n',
          type: 'user',
          default: ''
        }
      ]
    });
  }

  async run(msg, { user, user2 }) {
    
    if (user.id === msg.author.id && !user2) return msg.replyConfirm('actions.alone');
    const { body } = await snekfetch.get('https://rra.ram.moe/i/r?type=kiss').catch(() => {
      return msg.replyError('default.api.offline', 'Kiss');
    });
    const emojis = '<:RamKiss:301858777378848768> <:RemKiss:301858774258417674>';
    const emote = msg.guild.id === '292709515969953802' ? emojis : '❤';
    const image = this.getURL(body.path);
    if(user2) {
      return msg.embed({
        color: this.client.colors.love,
        title: `${emote} ${msg.guild.getKey('actions.event'), msg.guild.getKey('actions.kiss')}`,
        description: msg.guild.getKey('actions.kiss.forced', msg.author.tag, user.tag, user2.tag),
        image: {
          url: image
        }
      });
    }
    return msg.embed({
      color: 0xff42cc,
      title: `${emote} ${msg.guild.getKey('actions.event'), msg.guild.getKey('actions.kiss')}`,
      description: msg.guild.getKey('actions.kiss.action', msg.author.tag, user.tag),
      image: {
        url: image
      }
    });
  }
  getURL(path) {
    return `https://cdn.ram.moe/${path.replace('/i/', '')}`;
  }
};