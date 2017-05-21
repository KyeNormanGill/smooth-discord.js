
class Command {
	constructor(options = {}) {
		if (options.name === undefined) throw Error('No name property detected in command.');
		if (options.description === undefined) throw Error('No description detected in command.');
		if (options.guildOnly === undefined) options.guildOnly = false;

		this.name = options.name;
		this.description = options.description;
		this.guildOnly = options.guildOnly;
	}
}

module.exports = Command;
