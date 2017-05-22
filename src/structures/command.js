
class Command {
	/**
	 * @typedef {Object} ClientOptions
	 * @property {string} name - The name of the command.
	 * @property {string} description - The description of the command.
	 * @property {boolean} guildOnly - If the command can only by ran inside a guild channel.
	 * @property {boolean} clean - If the message that ran a command should be deleted.
	 * @property {string[]} aliases - An Array of aliases the command can use.
	 */

	/**
	 * @param {CommandOptions} options - The commands options.
	 */
	constructor(options = {}) {
		if (options.name === undefined) throw Error('No name property detected in command.');
		if (options.description === undefined) throw Error('No description detected in command.');
		if (options.guildOnly === undefined) options.guildOnly = false;
		if (options.clean === undefined) options.clean = false;
		console.log(`Aliases: ${options.aliases}`);
		if (options.aliases === undefined) options.aliases = [];
		console.log(`Aliases: ${options.aliases}`);
		if (options.aliases instanceof Array) throw Error('Aliases must be an Array.');

		/**
		 * The name of the command.
		 * @type {string}
		 */
		this.name = options.name;

		/**
		 * The description of the command.
		 * @type {string}
		 */
		this.description = options.description;

		/**
		 * If the command can only by ran inside a guild channel.
		 * @type {boolean}
		 */
		this.guildOnly = options.guildOnly;

		/**
		 * If the message that ran a command should be deleted.
		 * @type {boolean}
		 */
		this.clean = options.clean;

		/**
		 * An Array of aliases the command can use.
		 * @type {string[]}
		 */
		this.aliases = options.aliases;
	}
}

module.exports = Command;
