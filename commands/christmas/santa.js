const commando = require('discord.js-commando');

class SantaCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'asksanta',
            group: 'christmas',
            memberName: 'asksanta',
            description: 'Tells you if you`ve been naughty or nice'
        });
    }

    async run(message, args) {
        
        var randSanta = Math.floor(Math.random() * 2) + 1;
        if (randSanta == 1) {
            message.reply("You've been **Nice** this year!");
        } else if (randSanta == 2) {
            message.reply("You've been **Naughty** this year!");
        }
    }

}

module.exports = SantaCommand; 