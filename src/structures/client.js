const { Client, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const MessageHandler = require('../handlers/message.js');
const messageH = new MessageHandler();

class SmoothClient extends Client {
	/**
	 * @typedef {Object} CommandOptions
	 * @property {string[]} owners - The IDs of the bot owners.
	 * @property {string} prefix - The prefix to use with this bot.
	 * @property {boolean} selfbot - Whether or not this bot is a selfbot.
	 * @property {string} commandDirectory - The directory in which the commands are held.
	 * @property {boolean} debug - Whether or not to log extra information to console.
	 * @property {boolean} unkownCommandResponse - If the bot should respond if it sees a message that starts with it's prefix but isn't a command.
	 */

	/**
	 * @param {ClientOptions} options - The clients options.
	 */
	constructor(options = {}) {
		super(options);
		if (options.owners === undefined) throw Error('You must specify atleast 1 ownerID.');
		if (!Array.isArray(options.owners)) throw Error('Owners must be an Array.');
		if (options.owners.length < 1) throw Error('You must specify atleast 1 ownerID');
		if (options.selfbot === undefined) options.selfbot = false;
		if (options.selfbot && options.owners.length > 1) throw Error('You can only have one owner for a selfbot.');
		if (options.prefix === undefined) options.prefix = '!';
		if (options.commandDirectory === undefined) throw Error('No commands directory specified');
		if (options.debug === undefined) options.debug = false;
		if (options.unkownCommandResponse === undefined) options.unkownCommandResponse = false;

		/**
		 * The IDs of the bot owners.
		 * @type {string[]}
		 */
		this.owners = options.owners;

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
		 * The collection of the commands.
		 * @type {Collection<command name, command>}
		 */
		this.commands = new Collection();

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

			fs.readdir(this.options.commandDirectory, (err, files) => {
				if (err) console.error(err);
				for (const file of files) {
					if (path.extname(file) !== '.js') continue;
					const Command = require(path.join(this.options.commandDirectory, file));
					const cmd = new Command();
					this.commands.set(cmd.name, cmd);
					if (this.debug) console.log(`Loaded ${cmd.name}.js`);
				}
				if (this.debug) console.log(`Loaded ${this.commands.size} commands!`);
				resolve();
			});
		});
	}
}

module.exports = SmoothClient;
