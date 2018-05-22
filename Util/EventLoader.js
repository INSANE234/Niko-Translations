const reqEvent = event => require(`../Events/${event}`);
const OneShot = require('../Classes/OneShot'); // eslint-disable-line no-unused-vars
/**
 * Load all events and pass the params to event specific files.
 * @param {OneShot} client 
 */
module.exports = client => {
  client.on('ready', () => reqEvent('ready')(client));
  client.on('disconnect', () => reqEvent('disconnect')(client));
  client.on('reconnecting', () => reqEvent('reconnecting')(client));
  client.on('error', err => reqEvent('error')(err, client));
  client.on('warn', warn => reqEvent('warn')(warn, client));
  client.on('debug',  info => reqEvent('debug')(info, client));
  client.on('message', reqEvent('message'));
  client.on('commandRun', reqEvent('commandRun')); 
  client.on('commandError', reqEvent('commandError'));
  client.on('guildCreate', reqEvent('guildCreate'));
  client.on('guildDelete', reqEvent('guildDelete'));
  client.on('guildMemberAdd', reqEvent('guildMemberAdd'));
  client.on('guildMemberRemove', reqEvent('guildMemberRemove'));
  client.on('userUpdate', reqEvent('userUpdate'));
  // client.on('raw', reqEvent('raw'));
  client.on('unknownCommand', reqEvent('unknownCommand'));
  client.on('rateLimit', rateLimit => reqEvent('rateLimit')(client, rateLimit));
};
