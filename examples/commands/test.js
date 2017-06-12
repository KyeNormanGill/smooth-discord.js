const { Command } = require('../../src/index.js');
const { stripIndents } = require('common-tags');

module.exports = class TestCommand extends Command {
	constructor() {
		super({
			name: 'test', // Name of the command
			description: 'Displays the results of the test command.', // Added description for help commands.
			guildOnly: true, // If the command can only be used inside a server.
			ownerOnly: false, // If the command can only be used by an owner.
			aliases: ['test1', 'foobar'], // Other words that will trigger this command.
			perms: ['MENTION_EVERYONE'] // The bot must have the mention everyone permission.
		});
	}

	run(message, args) {
		message.channel.send(stripIndents`
			**Command:** ${this.name}
			**Args:** ${args}
			**Author:** ${message.author.tag}
		`);
	}
};
