class Handler {
	handleMessage(message) {
		const prefix = message.client.prefix;

		// Prefix check.
		if (!message.content.startsWith(prefix)) return;

		// Required checks.
		if (message.author.bot) return;

		// Selfbot check.
		if (message.client.selfbot && !message.client.owners.includes(message.author.id)) return;

		// Get Command.
		const commandName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// Command check.
		if (!command) {
			if (message.client.unkownCommandResponse) message.reply('Unkown command.');
			return;
		}

		// Owner only check
		if (command.ownerOnly && !message.client.owners.includes(message.author.id)) return;

		// GuildOnly Check.
		if (command.guildOnly && message.channel.type !== 'text') return;

		const args = message.content.split(' ').slice(1).join(' ');

		try {
			// Run command.
			command.run(message, args);

			// Debug console check.
			if (message.client.debug) console.log(`Command ${command.name} was triggered by ${message.author.username} with args: '${args}'`);

			// Emit commandRun event
			message.client.emit('commandRun', command, message);
		} catch (err) {
			// Emit commandError event
			message.client.emit('commandError', command, err);

			// Error response check
			if (message.client.errorResponse) message.channel.send(`An error occured while trying to run **${command.name}.**\`\`\`${err.name}: ${err.message}\`\`\`Please contact: **${message.client.owners.map(owner => message.client.users.get(owner).tag).join(' ')}**`);
		}
	}
}

module.exports = Handler;
