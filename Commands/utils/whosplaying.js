const { Command } = require('discord.js-commando');
module.exports = class WhosPlayingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'whosplaying',
      group: 'utils',
      aliases: ['whpl'],
      memberName: 'whosplaying',
      description: 'Get who\'s is playing the specified game in this guild',
      examples: ['whpl [game]'],
      args: [
        {
          key: 'game',
          prompt: 'What game you want to use as filter?\n',
          type: 'string'
        }
      ]
    });
  }

  run(msg, { game }) {
    const members = msg.guild.members.map(m => m.user);
    let playing = '';
    for(const m of members) {
      if(m.presence.activity && m.presence.activity.name.toLowerCase() === game.toLowerCase()) 
        continue;
      playing += `::: ${m.tag}\n`;
      
    }
    return msg.say(playing ? playing : msg.guild.getKey('utils.whpl.empty'), {
      code: 'asciidoc'
    });
  }
};
