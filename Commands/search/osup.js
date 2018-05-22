const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
module.exports = class OsuP extends Command {
  constructor(client) {
    super(client, {
      name: 'osup',
      group: 'search',
      memberName: 'osup',
      description: 'Profile card for a osu player',
      examples: ['osup [player] [mode] [color](Optional)'],
      clientPermissions: ['ATTACH_FILES'],
      args: [
        {
          key: 'player',
          prompt: 'Player to get the profile',
          type: 'string'
        },
        {
          key: 'mode',
          prompt: 'Mode(taiko, standard, mania, catchthebeat)',
          type: 'string',
          validate: mode => {
            if(mode.match(/^(taiko|standard|mania|catchthebeat|std|ctb)/))
              return true;
            return 'Please type a valid mode!';
          }
        },
        {
          key: 'color',
          prompt: 'Color of the profile card',
          type: 'string',
          default: '7f2dfc',
          validate: color => {
            if(color.match(/^.(?:[0-9a-f-A-F]{5})/)) 
              return true;
            return 'Please type a valid hex color code within #';
          }
        }
      ]
    });
  }

  async run(msg, { player, mode, color }) {
    color.replace('#', '');
    const m = mode.resolveMode();
    const url = `https://lemmmy.pw/osusig/sig.php?colour=hex${color}&uname=${player}&flagshadow&xpbar&xpbarhex&pp=2&mode=${m}&countryrank`;
    const { body: profile, ok } = await get(url);
    if(!ok) return null;
    return msg.say(`Osu profile card for **${player}**`, {files:[{attachment: profile}]});
  }
};

