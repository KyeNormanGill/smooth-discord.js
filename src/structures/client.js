const { Client, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const MessageHandler = require('../handlers/message.js');
const messageH = new MessageHandler();

class SmoothClient extends Client {
	constructor(options = {}) {
		super(options);

		if (options.commandDirectory === undefined) options.commandDirectory = path.join(__dirname, 'commands');
		if (options.prefix === undefined) options.prefix = '!';
		if (options.debug === undefined) options.debug = false;
		if (options.selfbot === undefined) options.selfbot = false;

		// Make this mapped by command name.
		this.commands = new Collection();
		// Mapped by command name aswell but values are alias arrays.
		// this.aliases = new Collection();

		this.prefix = options.prefix;

		this.on('message', message => messageH.handleMessage(message));
	}

	login(token) {
		return new Promise((resolve, reject) => {
			super.login(token).catch(reject);

			// Needs to be updated
			fs.readdir(this.options.commandDirectory, (err, files) => {
				if (err) console.error(err);
				for (const file of files) {
					if (path.extname(file) !== '.js') continue;
					const Command = require(path.join(this.options.commandDirectory, file));
					const cmd = new Command();
					this.commands.set(cmd.name, cmd);
				}
				console.log(`Loaded ${this.commands.size} commands!`);
			});
		});
	}
}

module.exports = SmoothClient;
