const { Client, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const MessageHandler = require('../handlers/message.js');
const messageH = new MessageHandler();

class SmoothClient extends Client {
	/**
	 * @typedef {Object} CommandOptions
	 * @property {string} owner - The bot owners ID.
	 * @property {string} prefix - The prefix to use with this bot.
	 * @property {boolean} selfbot - Whether or not this bot is a selfbot.
	 * @property {string} commandDirectory - The directory in which the commands are held.
	 * @property {boolean} debug - Whether or not to log extra information to console.
	 * @property {boolean} unkownCommandNotification - If the bot should respond if it sees a message that starts with it's prefix but isn't a command.
	 */

	/**
	 * @param {ClientOptions} options - The clients options.
	 */
	constructor(options = {}) {
		super(options);

		if (options.owner === undefined) throw Error('Could not find owner ID');
		if (options.prefix === undefined) options.prefix = '!';
		if (options.selfbot === undefined) options.selfbot = false;
		if (options.commandDirectory === undefined) throw Error('No commands directory specified');
		if (options.debug === undefined) options.debug = false;
		if (options.unkownCommandNotification === undefined) options.unkownCommandNotification = false;

		/**
		 * The bot owners ID.
		 * @type {string}
		 */
		this.owner = options.owner;

		/**
		 * The prefix of the bot.
		 * @type {string}
		 */
		this.prefix = options.prefix;

		/**
		 * Whether or not this bot will be a selfbot.
		 * @type {boolean}
		 */
		this.selfbot = options.selfbot;

		/**
		 * The directory of the commands.
		 * @type {string}
		 */
		this.commandDirectory = options.commandDirectory;

		/**
		 * Whether or not to log extra information to console.
		 * @type {boolean}
		 */
		this.debug = options.debug;

		/**
		 * If the bot should respond if it sees a message that starts with it's prefix but isn't a command.
		 * @type {boolean}
		 */
		this.unkownCommandResponse = options.unkownCommandResponse;

		/**
		 * The directory of the commands
		 * @type {Collection<command name, command>}
		 */
		this.commands = new Collection();

		// this.aliases = new Collection();

		this.on('message', message => messageH.handleMessage(message));
	}

	/**
     * Logins the client and initialises the commands.
     * Resolves once client is ready.
     * @param {string} token - Client token.
     * @returns {Promise<string>}
     */

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
