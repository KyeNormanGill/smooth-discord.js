const smooth = require('../src');
const path = require('path');

const client = new smooth.Client({
	commandDirectory: path.join(__dirname, 'commands'),
	disableEveryone: true,
	prefix: '...'
});

client.on('ready', () => {
	console.log(`Logged on as ${client.user.tag}`);
});

client.on('commandRun', command => {
	console.log(`Command ${command.name} was run!`);
});

client.login('tokengoeshere');
