const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
module.exports = class Weather extends Command {
  constructor(client) {
    super(client, {
      name: 'weather',
      group: 'search',
      memberName: 'weather',
      description: 'Sends the weather information for your city',
      examples: ['weather [city]', 'weather London, UK'],
      guildOnly: true,
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'city',
          prompt: 'What city you want to get the information?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { city }) {
    try {
      const result = await this.getWeather(city);
      return msg.embed({
        color: this.client.colors.ok,
        fields: [
          {
            name: msg.guild.getKey('search.weather.location'),
            value: `[${result.name}, ${result.sys.country}](https://openweathermap.org/city/${result.id})`,
            inline: true
          },
          {
            name: msg.guild.getKey('search.weather.lat-lon'),
            value: `${result.coord.lat}, ${result.coord.lon}`,
            inline: true
          },
          {
            name: msg.guild.getKey('search.weather.condition'),
            value: result.weather[0].main,
            inline: true
          },
          {
            name: msg.guild.getKey('search.weather.humidity'),
            value: `${result.main.humidity} %`,
            inline: true
          },
          {
            name: msg.guild.getKey('search.weather.windSpeed'),
            value: `${result.wind.speed} m/s`,
            inline: true
          },
          {
            name: msg.guild.getKey('search.weather.temperature'),
            value: `${result.main.temp} °C`,
            inline: true
          },
          {
            name: msg.guild.getKey('search.weather.min-max'),
            value: `${result.main.temp_min} °C - ${result.main.temp_max} °C`,
            inline: true
          },
        ],
        footer: {
          text: result.weather[0].description,
          icon_url: `http://openweathermap.org/img/w/${result.weather[0].icon}.png`
        }
      });
    } catch(e) {
      return msg.say(msg.guild.getKey('search.weather.notFound'), {
        code: 'asciidoc'
      });
    }
  }
  async getWeather(city) {
    const { body, ok } = await snekfetch.get(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=e327affe1a337518322bfb99bb7323ef&units=metric`);
    if(!ok) return null;
    return body;
  }
};