
const Service = require('../../Classes/Services/ImageService');
const Level = require('../../Classes/Services/LevelService');
const { Command } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');
class ProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'profile',
      aliases: ['p'],
      group: 'level',
      memberName: 'profile',
      description: 'Display your profile.',
      guildOnly: true,
      clientPermissions: ['ATTACH_FILES'],
      args: [
        {
          key: 'user',
          prompt: 'User to get profile',
          type: 'user',
          validate: (user, msg, arg) => {
            user = this.client.registry.types.get('user').parse(user, msg, arg);
            if(!user || user.bot)
              return false;
            return true;
          },
          default: msg => msg.author
        }
      ]
    });
    this.cache = new Map();
  }

  async run(msg, { user }) {
    if(!user)
      user = await this.client.users.fetch(user);
    let picture;
    msg.channel.startTyping();
    if(!this.cache.has(user.id)) {
      const row = await Level.getRow(user);
      picture = await Service.profile(row, user, msg);
      this.cache.set(user.id, {
        picture,
        lastUsed: Date.now(),
        timeout: setTimeout(() => {
          this.cache.delete(msg.author.id);
        }, (60 * 1000) * 10)
      });
    } else {
      picture = this.cache.get(user.id).picture;
    }
    msg.channel.stopTyping();
    const base = this.cache.get(user.id).lastUsed + (60 * 1000) * 10;
    const updateTime = moment.duration(base - Date.now()).format('mm:ss');
    return msg.say(msg.guild.getKey('level.profile.updateAfter', updateTime), { files: [{ attachment: picture, name: 'profile.png' }] });
  }
}

module.exports = ProfileCommand;