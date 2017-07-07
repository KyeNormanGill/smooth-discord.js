const { Permissions } = require('discord.js');

class Handler {
	handleMessage(message) {
		const prefix = message.client.prefix;

		// Mention check.
		const regex = new RegExp(`^<@!?${message.client.user.id}>`);
		const isMention = regex.test(message.content);

		if (message.client.selfbot && isMention) return;

		// Get command name.
		let commandName;
		if (isMention) {
			commandName = message.content.split(' ').slice(1)[0].toLowerCase();
		} else {
			commandName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
		}

		// Prefix check.
		if (!message.content.startsWith(prefix) && !isMention) return;

		// Required checks.
		if (message.author.bot) return;

		// Selfbot check.
		if (message.client.selfbot && !message.client.owners.includes(message.author.id)) return;

		// Get command.
		const command = message.client.commands.get(commandName)
				|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// Command check.
		if (!command) {
			if (message.client.unknownCommandResponse) message.reply('unknown command!').catch(console.log);
			return;
		}

		// Send message perm check.
		if (message.channel.type === 'text' && !message.channel.permissionsFor(message.client.user).has('SEND_MESSAGES')) {
			message.author.send(`I do not have permission to speak in ${message.channel.toString()}`).catch(console.log);
		}

		// Owner only check
		if (command.ownerOnly && !message.client.owners.includes(message.author.id)) return;

		// GuildOnly Check.
		if (command.guildOnly && message.channel.type !== 'text') return;

		// Permissions check
		if (command.perms) {
			let text = '';
			command.perms.forEach(perm => {
				if (!Object.keys(Permissions.FLAGS).includes(perm)) {
					throw Error(`Command ${command.name} has an invalid permission name: ${perm}`);
				} else
				if (!message.channel.permissionsFor(message.client.user).has(perm)) {
					text += `${perm}\n`;
				}
			});
			if (text) {
				return message.channel.send(`Permission error, please give me the following permission(s) to use this command\`\`\`${text}\`\`\``);
			}
		}

		// Get args.
		let args;
		if (isMention) {
			args = message.content.split(' ').slice(2).join(' ');
		} else {
			args = message.content.split(' ').slice(1).join(' ');
		}

		try {
			// Run command.
			command.run(message, args);

			// Debug console check.
			if (message.client.debug) console.log(`Command ${command.name} was triggered by ${message.author.username} with args: '${args}'`);

			// Emit commandRun event
			message.client.emit('commandRun', command, message);
		} catch (err) {
			// Emit commandError event
			message.client.emit('commandError', command, err, message);

			message.channel.send(`An error occured while trying to run **${command.name}.**\`\`\`${err.name}: ${err.message}\`\`\`Please contact: **${message.client.owners.map(owner => message.client.users.get(owner).tag).join(' ')}**`);
		}
	}
}

module.exports = Handler;
