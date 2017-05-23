const { Client, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const MessageHandler = require('../handlers/message.js');
const messageH = new MessageHandler();

class SmoothClient extends Client {
	/**
	 * @typedef {Object} CommandOptions
	 * @property {string[]} ownerIDs - The IDs of the bot owners (Must be atleast 1 and must be only 1 if it's a selfbot).
	 * @property {string} prefix - The prefix to use with this bot.
	 * @property {boolean} selfbot - Whether or not this bot is a selfbot.
	 * @property {string} commandDirectory - The directory in which the commands are held.
	 * @property {boolean} debug - Whether or not to log extra information to console.
	 * @property {boolean} unkownCommandResponse - If the bot should respond if it sees a message that starts with it's prefix but isn't a command.
	 * @property {boolean} errorResponse - If the bot should respond in a channel if there is an error with a command.
	 */

	/**
	 * @param {ClientOptions} options - The clients options.
	 */
	constructor(options = {}) {
		super(options);
		if (options.ownerIDs === undefined) throw Error('You must specify atleast 1 owner.');
		if (!Array.isArray(options.ownerIDs)) throw Error('Owners must be a typeOf Array.');
		if (options.ownerIDs.length < 1) throw Error('You must specify atleast 1 owner.');
		if (options.selfbot === undefined) options.selfbot = false;
		if (options.selfbot === true && options.ownerIDs.length !== 1) throw Error('You cannot have more than 1 owner for a selfbot.');
		if (options.prefix === undefined) options.prefix = '!';
		if (options.commandDirectory === undefined) throw Error('No commands directory specified');
		if (options.debug === undefined) options.debug = false;
		if (options.unkownCommandResponse === undefined) options.unkownCommandResponse = false;
		if (options.errorResponse === undefined) options.errorResponse = true;

		/**
		 * The IDs of the bot owners (Must be atleast 1 and must be only 1 if it's a selfbot).
		 * @type {string[]}
		 */
		this.ownerIDs = options.ownerIDs;
		console.log(`OwnerIDs: ${this.ownerIDs}`);

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
		 * If the bot should respond in a channel if there is an error with a command.
		 * @type {boolean}
		 */
		this.errorResponse = options.errorResponse;

		/**
		 * The collection of the commands.
		 * @type {Collection<command name, command>}
		 */
		this.commands = new Collection();

		/**
		 * The collection of the owners by user object.
		 * @type {Collection<ownerID, userobject>}
		 */
		this.owners = new Collection();

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

			// Initialise commands
			fs.readdir(this.options.commandDirectory, (err, files) => {
				if (err) console.error(err);
				for (const file of files) {
					if (path.extname(file) !== '.js') continue;
					const Command = require(path.join(this.options.commandDirectory, file));
					const cmd = new Command();
					this.commands.set(cmd.name, cmd);
					if (this.debug) console.log(`Loaded ${cmd.name}.js`);
				}
				console.log(`Loaded ${this.commands.size} commands!`);
			});

			// Store users in client
			this.ownerIDs.forEach(ownerID => this.owners.set(ownerID, this.users.get(ownerID)));
			console.log(this.owners);
		});
	}
}

module.exports = SmoothClient;
