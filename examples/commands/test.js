const { Command } = require('../../src/index.js');
const { stripIndents } = require('common-tags');

module.exports = class TestCommand extends Command {
	constructor() {
		super({
			name: 'test',
			description: 'Is a test command',
			guildOnly: false
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
