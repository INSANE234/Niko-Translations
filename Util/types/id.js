const { ArgumentType } = require('discord.js-commando');
class IDArgumentType extends ArgumentType {
  constructor(client) {
    super(client, 'id');
  }
  validate(value) {
    if(value.match(/^[0-9]+$/)) {
      return true;
    }
    return false;
  }
  parse(value) {
    if(value.match(/^[0-9]+$/)) {
      return value;
    }
    return null;
  }
}
module.exports = IDArgumentType;