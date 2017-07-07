const smooth = require('../src');

const client = new smooth.Client({
	owners: ['189696688657530880'], // My Discord id
	prefix: '!', // My prefix
	selfbot: false, // If this is a selfbot
	commandDirectory: require('path').join(__dirname, 'commands'), // The directory of my commands
	debug: true, // If i want extra logs in my console.
	unknownCommandResponse: false // If i should respond to unknown commands
});

client.on('ready', () => {
	console.log(`Logged on as ${client.user.tag}`);
});

client.on('commandRun', command => {
	console.log(`Command ${command.name} was run!`);
});

client.login('tokengoeshere');
