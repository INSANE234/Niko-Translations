
const moment = require('moment');
const cheerio = require('cheerio');
const { get } = require('snekfetch');
const { TWITCH } = process.env;
const { Message } = require('discord.js'); // eslint-disable-line no-unused-vars
class StreamUtil {
  /**
   * Check if a openRec user is streaming and notice all channels.
   * @param {Sequelize.Model} row 
   * @param {CommandoClient} client 
   * @returns {Promise<Message>} embed that has sended.
   */
  static async openRec(row, client) {
    const username = row.get('username');
    const isLive = await this.isLive(username);
    if(isLive) {
      const channel = client.channels.get(row.get('channelid'));
      if(!channel || !channel.permissionsFor(client.user).has(['SEND_MESSAGES', 'EMBED_LINKS'])) 
        return;
      const json = await this.getData(username);
      if(row.get('streaming') === false) {
        const embed = {
          color: 0xfc7f25,
          title: json.username,
          description: `[${json.title ? json.title : channel.guild.getKey('tracker.streamNoTitle')}](${json.url})`,
          thumbnail: {
            url: json.image ? json.image : 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png'
          },
          fields: [
            {
              name: channel.guild.getKey('tracker.streamGame'),
              value: json.game ? json.game : 'Games & Demos'
            },
            {
              name: channel.guild.getKey('tracker.streamFollowers'),
              value: json.followers,
              inline: true
            },
            {
              name: channel.guild.getKey('tracker.streamViews'),
              value: json.views,
              inline: true
            },
          ],
          timestamp: new Date()
        };

        await row.update({ streaming: true, startedAt: Date.now()});
        return channel.send({ embed });
      }
    } else {
      if(row.get('streaming') === true) {
        await row.update({ streaming: false });
        const channel = client.channels.get(row.get('channelid'));
        const username = row.get('username');
        const now = Date.now();
        const calc = now - row.get('startedAt');
        const time = moment.duration(calc).format('HH:mm:ss');
        return channel.send({
          embed: {
            color: client.colors.error,
            author: { 
              name: username,
              url: `https://www.openrec.tv/live/${username}`
            },
            description: channel.guild.getKey('tracker.stream.off', username),
            footer: {
              text: channel.guild.getKey('tracker.stream.streamedFor', time)
            },
            timestamp: new Date()
          }
        });
      }
    }
  }
  /**
   * Check whether or not the user is streaming **OpenRec only**.
   * @param {string} username 
   * @returns {Promise<boolean>} true if user is streaming otherwise false.
   */
  static async isLive(username) {
    const { text } = await get(`https://www.openrec.tv/live/${username}`);
    const $ = cheerio.load(text);
    const isLive = $('span.p-playbox__content__info__frame__live')[0] ? true : false;
    const title = $('div.p-playbox__content__info__title').text().trim();
    if(title === '(OFFLINE)')
      return 'User do not exists!';
    return isLive;
  }
  static async getData(username) {
    const { text } = await get(`https://www.openrec.tv/live/${username}`);
    const $ = cheerio.load(text);
    const title = $('div.p-playbox__content__info__title').text().trim();
    const image = $('a.p-playbox__content__info__userframe__user__img').find('img')[0].attribs.src;
    const game = $('span.p-playbox__content__info__frame__count__title__link').find('a').text();
    const followers = $('span.p-playbox__content__info__userframe__user__info__follow__noFollow__count').text();
    const views = $('span.js-data__allViewers').text();
    return {
      url: `https://www.openrec.tv/live/${username}`,
      username,
      title,
      image,
      game,
      followers,
      views
    };
  }
  static async twitch(row, client) {
    const channel = client.channels.get(row.get('channelid'));
    if(!channel || !channel.permissionsFor(client.user).has(['SEND_MESSAGES', 'EMBED_LINKS'])) 
      return;
    const { body: json } = await get(`https://api.twitch.tv/kraken/streams/${encodeURI(row.get('username'))}?client_id=${TWITCH}`)
      .catch(() => {
        return;
      });
    if(json.stream) {
      if(row.get('streaming') === false) {
        const embed = {
          color: 0x802bff,
          title: json.stream.channel.display_name,
          description: `[${json.stream.channel.status ? json.stream.channel.status : channel.guild.getKey('tracker.streamNoTitle')}](${json.stream.channel.url})`,
          thumbnail: {
            url: json.stream.channel.logo ? json.stream.channel.logo : 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png'
          },
          fields: [
            {
              name: channel.guild.getKey('tracker.streamGame'),
              value: json.stream.game ? json.stream.game : 'Games & Demos'
            },
            {
              name: channel.guild.getKey('tracker.streamFollowers'),
              value: json.stream.channel.followers,
              inline: true
            },
            {
              name: channel.guild.getKey('tracker.streamViews'),
              value: json.stream.channel.views,
              inline: true
            },
          ],
          timestamp: new Date()
        };
        await row.update({ streaming: true, startedAt: json.stream.created_at });
        return channel.send({ embed });
      }
    } else {
      if(row.get('streaming') === true) {
        await row.update({ streaming: false });
        const channel = client.channels.get(row.get('channelid'));
        const username = row.get('username');
        const now = new Date().toISOString();
        const calc = new Date(now) - new Date(row.get('startedAt'));
        const time = moment.duration(calc).format('HH:mm:ss');
        return channel.send({
          embed: {
            color: client.colors.error,
            author: { 
              name: username,
              url: `https://twitch.tv/${username}`
            },
            description: channel.guild.getKey('tracker.stream.off', username),
            footer: {
              text: channel.guild.getKey('tracker.stream.streamedFor', time)
            },
            timestamp: new Date()
          }
        });
      }
    }
  }
  static async channelExists(username) {
    const { text, ok } = await get(`https://www.openrec.tv/live/${username}`);
    if(!ok)
      return false;
    const $ = cheerio.load(text);
    const exists = $('a.p-playbox__content__info__userframe__user__img').find('img')[0] ? true : false;
    return exists;
  }
}
module.exports = StreamUtil;