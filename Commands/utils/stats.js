const { Command } = require('discord.js-commando');
const { version } = require('discord.js');
const moment = require('moment');
module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      group: 'utils',
      memberName: 'stats',
      description: 'Some informations of Niko',
      examples: ['stats']
    });
  }

  run(msg) {
    const owners = [];
    if(Array.isArray(this.client.options.owner)) {
      for(const id of this.client.options.owner) 
        owners.push(this.client.users.get(id).username);
    }
    const uptime = moment.duration(this.client.uptime).format(' D [days], H [hours], m [mins], s [segs]');
    const shardid = `**Guild shard:** ${this.client.options.shardId} / ${this.client.options.shardCount}\n\n`;
    const link = `https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=0`;
    return msg.embed({
      color: this.client.colors.bot,
      author: {
        name: `OneShot ${this.client.configs.version}`,
        icon_url: this.client.user.displayAvatarURL()
      },
      description: `\n**Author:** ${owners.length > 1 ? owners.join(', ') : this.client.users.get(this.client.options.owner).username}\n\n**Uptime:** ${uptime}\n\n**Discord.JS:**  ${version}\n\n**Commands:** ${ this.client.registry.commands.filter(cmd=> cmd.isUsable(msg)).size + 8}\n\n**Guilds:** ${this.client.guilds.size}\n\n${this.client.shard ? shardid
        : ''}[Bot invite](${link})`,
      thumbnail: {
        url: msg.author.displayAvatarURL()
      },
      fields: [
        {
          name: 'Novidades',
          value: `\`\`\`Markdown\n${this.client.configs.news.join('\n')}\`\`\``
        }
      ]
    });
  }
};
