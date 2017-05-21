const { Client, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const MessageHandler = require('../handlers/message.js');
const messageH = new MessageHandler();



class SmoothClient extends Client {
	/**
	 * @typedef {Object} ClientOptions
	 * @property {string} owner - The owners ID of this bot.
	 * @property {string} prefix - The prefix to use with this bot.
	 * @property {boolean} [autoAliases=true] - Whether automatic aliases should be added
	 * @property {string} group - The ID of the group the command belongs to (must be lowercase)
	 * @property {string} memberName - The member name of the command in the group (must be lowercase)
	 * @property {string} description - A short description of the command
	 * @property {string} [format] - The command usage format string - will be automatically generated if not specified,
	 * and `args` is specified
	 * @property {string} [details] - A detailed description of the command and its functionality
	 * @property {string[]} [examples] - Usage examples of the command
	 * @property {boolean} [guildOnly=false] - Whether or not the command should only function in a guild channel
	 * @property {ThrottlingOptions} [throttling] - Options for throttling usages of the command.
	 * @property {PermissionResolvable[]} [clientPermissions] - Permissions the bot needs for the command to function.
	 * @property {PermissionResolvable[]} [userPermissions] - Permissions that a user must have to use the command.
	 * @property {boolean} [defaultHandling=true] - Whether or not the default command handling should be used.
	 * If false, then only patterns will trigger the command.
	 * @property {ArgumentInfo[]} [args] - Arguments for the command.
	 * @property {number} [argsPromptLimit=Infinity] - Maximum number of times to prompt a user for a single argument.
	 * Only applicable if `args` is specified.
	 * @property {string} [argsType=single] - One of 'single' or 'multiple'. Only applicable if `args` is not specified.
	 * When 'single', the entire argument string will be passed to run as one argument.
	 * When 'multiple', it will be passed as multiple arguments.
	 * @property {number} [argsCount=0] - The number of arguments to parse from the command string.
	 * Only applicable when argsType is 'multiple'. If nonzero, it should be at least 2.
	 * When this is 0, the command argument string will be split into as many arguments as it can be.
	 * When nonzero, it will be split into a maximum of this number of arguments.
	 * @property {boolean} [argsSingleQuotes=true] - Whether or not single quotes should be allowed to box-in arguments
	 * in the command string.
	 * @property {RegExp[]} [patterns] - Patterns to use for triggering the command
	 * @property {boolean} [guarded=false] - Whether the command should be protected from disabling
	 */

	/**
	 * @param {ClientOptions} options - The clients options
	 */
	constructor(options = {}) {
		super(options);

		if (options.commandDirectory === undefined) throw Error('No commands directory specified');
		if (options.prefix === undefined) options.prefix = '!';
		if (options.debug === undefined) options.debug = false;
		if (options.selfbot === undefined) options.selfbot = false;
		if (options.unkownCommandNotification === undefined) options.unkownCommandNotification = false;

		/**
		 * The directory of the commands.
		 * @type {string}
		 */
		this.commandDirectory = options.commandDirectory;

		/**
		 * The prefix of the bot.
		 * @type {string}
		 */
		this.prefix = options.prefix;

		/**
		 * Whether or not to log extra information to console.
		 * @type {boolean}
		 */
		this.debug = options.debug;

		/**
		 * Whether or not this bot will be a selfbot.
		 * @type {boolean}
		 */
		this.selfbot = options.selfbot;

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
