const commando = require('discord.js-commando');

class ChristmasCountCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cd',
            group: 'christmas',
            memberName: 'cd',
            description: 'Countdown for the number of days until Christmas'
        });
    }
}

module.exports = ChristmasCountCommand;