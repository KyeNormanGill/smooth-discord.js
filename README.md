# smooth-discord.js
This is a discord bot framework created by me (Artful). Written in javascript with the `discord.js` library.
https://discord.js.org/#/

Join my discord server: https://discord.gg/MBVyQdT

## Usage
* Node.js 6+

## Features
* Dynamic command handler. (Choose your directory)
* Selfbot support.

## Soon to come
* Multiple aliases for commands.
* Permission checking.

## Command template
```js
const { Command } = require('smooth-discord.js');

module.exports = class TestCommand extends Command {
	constructor() {
		super({
			name: 'test',
			description: 'Is test command',
			guildOnly: false
		});
	}

	run(message, args) {
    // Command stuff goes here.
	}
};
```

## Credits
[Kye](https://github.com/KyeNormanGill "My github") - Creator/Developer.

## Want to contribute?
Fork it!

Create your feature branch: git checkout -b my-new-feature

Commit your changes: git commit -am 'Add some feature'

Push to the branch: git push origin my-new-feature

Submit a pull request!
