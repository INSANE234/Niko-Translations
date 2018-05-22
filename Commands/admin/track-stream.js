const { Command } = require('discord.js-commando');
const { get }  = require('snekfetch');
const { TWITCH } = process.env;
const db = require('../../Classes/SQLite').db;
const streams = db.import('../../Data/Models/Streams');
const { oneLine } = require('common-tags');
module.exports = class TrackStreamCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'track-stream',
      group: 'admin',
      aliases: ['tstr'],
      memberName: 'track-stream',
      description: oneLine`Start tracking the provided stream. If the stream channel is from openrec, provide the full link
      otherwise it will count as twitch link`,
      examples: ['tstr [stream] [type] [channel]'],
      guildOnly: true,
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          key: 'stream',
          prompt: 'What stream channel do you want to track?\n',
          type: 'string',
          parse: stream => {
            const regex = /^.*((?:https?:\/\/)go\.|twitch\.tv\/(\w+))/g;
            if(stream.match(regex)) 
              return regex.exec(stream)[2];
            return stream;
          }
        },
        {
          key: 'channel',
          prompt: 'What channel the stream will be tracked?\n',
          type: 'channel',
          default: msg => msg.channel
        }
      ]
    });
  }

  async run(msg, { stream, channel, type }) {
    try {
      if(type === 0) {
        await get(`https://api.twitch.tv/kraken/channels/${encodeURI(stream)}?client_id=${TWITCH}`);
      }
    } catch(e) {
      return msg.replyError('admin.track-stream.notExist');
    }
    streams.findOrCreate({
      where: {
        guildid: { [db.Sequelize.Op.eq]: msg.guild.id }, 
        username: { [db.Sequelize.Op.eq]: stream },
        type
      },
      defaults: {
        channelid: channel.id
      }
    }).spread((stream, created) => {
      if(!created)
        return msg.replyError('admin.track-stream.alreadyTracked');
      return msg.replyConfirm('admin.track-stream.notify', stream.get('username'));
    });

  }
};