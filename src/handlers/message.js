class Handler {
	handleMessage(message) {
		const prefix = message.client.prefix;

		// Required checks
		if (message.author.bot) return;

		// Selfbot check
		if (message.client.selfbot && message.author.id !== message.client.owner) return;

		// Get Command
		const commandName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
		const command = message.client.commands.get(commandName);

		// Command check
		if (!command) return;

		// Ignore Prefix check
		if (!command.ignorePrefix && !message.content.startsWith(prefix)) return;

		// GuildOnly Check
		if (command.guildOnly && message.channel.type !== 'text') return;

		// Clean check
		if (command.clean) message.delete();

		const args = message.content.split(' ').slice(1).join(' ');
		command.run(message, args);
		message.client.emit('commandRun', command);
	}
}

module.exports = Handler;
