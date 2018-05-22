const util = require('util');
const discord = require('discord.js');
const tags = require('common-tags');
const escapeRegex = require('escape-string-regexp');
const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');
module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      group: 'owner',
      aliases: ['e'],
      memberName: 'eval',
      description: 'Executes JavaScript code.',
      details: 'Only the bot owner(s) may use this command.',
      guarded: true,
      ownerOnly: true,
      args: [
        {
          key: 'script',
          prompt: 'What code would you like to evaluate?',
          type: 'string'
        }
      ]
    });
    this.lastResult = null;
  }

  async run(msg, args) {
    // Make a bunch of helpers
    /* eslint-disable no-unused-vars */
    const message = msg;
    const client = msg.client;
    const objects = client.registry.evalObjects;
    const lastResult = this.lastResult;
    const doReply = async val => {
      if(val instanceof Error) {
        msg.reply(`Callback error: \`${val}\``);
      } else {
        const result = await this.makeResultMessages(val, process.hrtime(this.hrStart));
        if(Array.isArray(result)) {
          for(const item of result) {
            msg.reply(item);
          }
        } else {
          msg.edit({ embed: result });
        }
      }
    };
    /* eslint-enable no-unused-vars */

    // Run the code and measure its execution time
    let hrDiff;
    try {
      const hrStart = process.hrtime();
      this.lastResult = await eval(args.script);
      hrDiff = process.hrtime(hrStart);
    } catch(err) {
      return msg.reply(`Error while evaluating: \`${err}\``);
    }

    // Prepare for callback time and respond
    this.hrStart = process.hrtime();
    let response = await this.makeResultMessages(args.script, this.lastResult, hrDiff, args.script);
    const color = message.member && message.member.highestRole ? message.member.highestRole.color : this.client.colors.bot;
    response.setColor(color);
    if(msg.editable) {
      if(response instanceof Array) {
        if(response.length > 0) response = response.slice(1, response.length - 1);
        for(const re of response) msg.say(re);
        return null;
      } else {
        this.client.setTimeout(() => msg.edit({embed: response}), 2000);
      }
    } else {
      return msg.say({embed: response});
    }
  }

  async makeResultMessages(args, result, hrDiff, input = null) {
    const inspected = util.inspect(result, { depth: 0 })
      .replace(nlPattern, '\n')
      .replace(this.sensitivePattern, '--snip--');
    const split = inspected.split('\n');
    const last = inspected.length - 1;
    const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== '\'' ? split[0] : inspected[0];
    const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== '\'' ?
      split[split.length - 1] :
      inspected[last];
    const prepend = `\`\`\`javascript\n${prependPart}\n`;
    const append = `\n${appendPart}\n\`\`\``;
    if(input) {
      if(inspected.length > 1000) this.client.logger.info(inspected);
      const { body, ok } = await get('https://nekos.life/api/neko');
      if(!ok) return null;
      const { neko } = body;
      const embed = new discord.MessageEmbed()
        .setTitle('Evaluated JS')
        .setDescription(`:inbox_tray: Input\n\`\`\`javascript\n${args}\n\`\`\`\n:outbox_tray: Output ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.\n\`\`\`javascript\n${inspected.length > 1000 ? 'Output is too long' : inspected}\n\`\`\`
        `)
        .setThumbnail(neko)
        .setFooter(`Type: ${typeof result}`);
      return embed;
      // *Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
    } else {
      return discord.splitMessage(tags.stripIndents`
				*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, 1900, '\n', prepend, append);
    }
  }

  get sensitivePattern() {
    if(!this._sensitivePattern) {
      const client = this.client;
      let pattern = '';
      if(client.token) pattern += escapeRegex(client.token);
      Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
    }
    return this._sensitivePattern;
  }
};
