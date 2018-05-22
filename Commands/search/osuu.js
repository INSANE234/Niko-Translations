const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { OSUAPIKEY } = process.env;
module.exports = class OsuU extends Command {
  constructor(client) {
    super(client, {
      name: 'osuu',
      group: 'search',
      memberName: 'osuu',
      description: 'Profile info for a osu player',
      examples: ['osuu [Playername] [Mode](taiko, standard, mania or catchthebeat)'],
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          key: 'player',
          prompt: 'Player to get the profile',
          type: 'string'
        },
        {
          key: 'mode',
          prompt: 'Mode(taiko, standard, mania, catchthebeat)',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { player, mode }) {
    try {

      const m = mode.resolveMode();
      const { body: infos, ok } = await snekfetch.get(`https://osu.ppy.sh/api/get_user?k=${OSUAPIKEY}&u=${player}&m=${m}`);
      if(!ok || infos === '[]') 
        return msg.channel.sendError(msg.guild.getKey('search-osuu-not-found'));
      const embed = {
        color: this.client.resolver.resolveColor('RANDOM'),
        description: `**Userid:** ${infos[0].user_id}\n**Username:** ${infos[0].username}\n**Count 300:** ${parseInt(infos[0].count300).toLocaleString()}\n**Count 100:** ${parseInt(infos[0].count100).toLocaleString()}\n**Count 50:** ${parseInt(infos[0].count50).toLocaleString()}\n**Play Count:** ${parseInt(infos[0]['playcount']).toLocaleString()}\n**Ranked Score:** ${parseInt(infos[0].ranked_score).toLocaleString()}\n**Total Score:** ${parseInt(infos[0].total_score).toLocaleString()}\n**Rank:** #${infos[0].pp_rank}\n**Level:** ${Math.round(infos[0]['level'])}\n**PP:** ${parseInt(Math.round(infos[0].pp_raw)).toLocaleString()}\n**Accuracy:** ${(infos[0].accuracy).substr(0, 5)}%\n**Country:** ${infos[0].country}\n**Country Rank:** #${infos[0].pp_country_rank}\n**SS:** ${infos[0].count_rank_ss} **S:** ${infos[0].count_rank_s} **A:** ${infos[0].count_rank_a}\n\n[Profile](https://osu.ppy.sh/users/${player})`,
        thumbnail: {
          url: `https://a.ppy.sh/${infos[0].user_id}`
        },
        footer: {
          text: 'Provided by OSU! API'
        }
      };
      return msg.reply(`Osu Profile Info for **${player}**`, {embed});
    } catch(e) {
      this.client.logger.error(e.stack);
      return null;
    }
  }
};
