class Handler {
	handleMessage(message) {
		const prefix = message.client.prefix;

		// Prefix check
		if (!message.content.startsWith(prefix)) return;

		// Required checks
		if (message.author.bot) return;

		// Selfbot check
		if (message.client.selfbot && message.author.id !== message.client.owner) return;

		// Get Command
		const commandName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// Command check
		if (!command) {
			if (message.client.unkownCommandResponse) message.reply('Unkown command.');
			return;
		}

		// GuildOnly Check
		if (command.guildOnly && message.channel.type !== 'text') return;

		// Clean check
		if (command.clean) message.delete();

		const args = message.content.split(' ').slice(1).join(' ');
		command.run(message, args);
		if (message.client.debug) console.log(`Command ${command.name} was triggered by ${message.author.username} with args: '${args}'`);
		message.client.emit('commandRun', command);
	}
}

module.exports = Handler;
