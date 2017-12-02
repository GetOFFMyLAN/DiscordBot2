const commando = require('discord.js-commando');

class PlayMusicCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'plays music from youtube either by searching or by the user pasting a direct link to the video'
        });
    }

}

module.exports = PlayMusicCommand;