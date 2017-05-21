class messageHandler {
	handleMessage(message) {
		const prefix = message.client.prefix;
		if (message.author.bot || !message.content.startsWith(prefix)) return;

		const client = message.client;
		const commandName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
		const command = client.commands.get(commandName);
		const args = message.content.split(' ').slice(1).join(' ');

		if (!command) return;

		command.run(message, args);
		message.client.emit('commandRun', command);
	}
}

module.exports = messageHandler;
