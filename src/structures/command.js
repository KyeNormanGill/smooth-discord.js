class Command {
	/**
	 * @typedef {Object} ClientOptions
	 * @property {string} name - The name of the command.
	 * @property {string} description - The description of the command.
	 * @property {boolean} guildOnly - If the command can only by ran inside a guild channel.
	 * @property {boolean} ownerOnly - If the message can only be run by owners.
	 * @property {string[]} aliases - An Array of aliases the command can use.
	 * @property {string[]} perms - An Array of permissions the command needs.
	 */

	/**
	 * @param {CommandOptions} options - The commands options.
	 */
	constructor(options = {}) {
		if (options.name === undefined) throw Error('No name property detected in command.');
		if (options.description === undefined) throw Error('No description detected in command.');
		if (options.guildOnly === undefined) options.guildOnly = false;
		if (options.aliases === undefined) options.aliases = [];
		if (!Array.isArray(options.aliases)) throw Error('Aliases must be an Array.');
		if (options.ownerOnly === undefined) options.ownerOnly = false;
		if (options.perms === undefined) options.perms = [];

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
		 * If the message can only be run by owners.
		 * @type {boolean}
		 */
		this.ownerOnly = options.ownerOnly;

		/**
		 * An Array of aliases the command can use.
		 * @type {string[]}
		 */
		this.aliases = options.aliases;

		/**
		 * An Array of permissions the command needs.
		 * @type {string[]}
		 */
		this.perms = options.perms;
	}
}

module.exports = Command;
