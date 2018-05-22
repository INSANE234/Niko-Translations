const { Command } = require('discord.js-commando');
const { exec } = require('child_process');
class ExecuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      group: 'owner',
      memberName: 'exec',
      description: 'Execute\'s a command in cmd',
      examples: ['exec [Code]'],
      guildOnly: true,
      ownerOnly: true,
      args: [
        {
          key: 'code',
          prompt: 'Code to execute',
          type: 'string'
        }
      ]
    });
  }
  async run(msg, { code }) {
    try {
      const result = await ExecuteCommand.exec(code); 
      return msg.say(`➡ Input: \`\`\`${code}\`\`\` \n✅ Output:\n\`\`\`${result}\`\`\``);
    } catch(e) {
      this.client.emit('error', e);
      return msg.say(`➡ Input: \`\`\`${code}\`\`\` \n❎ Output:\n\`\`\`${e}\`\`\``);
    }
  }
  static exec(code) {
    return new Promise((resolve, reject) => {
      exec(code, (error, stdout, stderr) => {
        if (error) 
          reject('error: ' + error);
        resolve(`${stdout}\n\n ${stderr}`);
      });
    });
  }
}


module.exports = ExecuteCommand;