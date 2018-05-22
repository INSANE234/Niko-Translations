const { Command } = require('discord.js-commando');
/* eslint-disable no-unused-vars */
const { registerFont, createCanvas } = require('canvas');
const { fontFile } = require('../../Classes/Services/ImageService');
/* eslint-disable no-unused-vars */
class ColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'color',
      memberName: 'color',
      group: 'utils',
      description: 'Return a image painted by the specified color.',
      examples: ['color [hexcode]'],
      args: [
        {
          key: 'color',
          prompt: 'What\'s the color hex code?\n',
          type: 'string',
          validate: color => { 
            if(color.match(/^.(?:[0-9a-fA-F]){5}/)) return true;
            return 'Please type a valid hexadecimal color code!\n';
          }
        }
      ]
    });
  }

  async run(msg, { color }) {
    try {
      const image = this.getImage(color);
      return msg.say(color.bold(), {
        files: [{
          attachment: image,
          name: `${color}.png`
        }]
      });
    } catch(e) {
      this.client.emit('error', e);
      return null;
    }
  }
  getImage(color) {
    registerFont(fontFile('FontAwesome.ttf'), { family: 'FontAwesome' });
    const canvas = createCanvas(50, 50);
    const ctx = canvas.getContext('2d');
    ctx.font = '72px FontAwesome';
    ctx.fillStyle = `#${color}`;
    ctx.fillText('', -5, 50);
    return canvas.toBuffer();
  } 
}
module.exports = ColorCommand;