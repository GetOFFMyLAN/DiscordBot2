const discord = require('discord.js');
const commando = require('discord.js-commando');
const ytdl = require('ytdl-core');
const getYoutubeID = require('get-youtube-id');
const youtubeInfo = require('youtube-info');
const fs = require('fs');
const request = require('request');

var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

const bot = new commando.Client;

const yt_API = config.yt_API;
const discord_token = config.discord_token;
const bot_controller = config.bot_controller;
const prefix = config.prefix;

var queue = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipRequests = 0;
var skippers = [];

bot.registry.registerGroup('christmas', 'Christmas Commands' );
bot.registry.registerGroup('fun', 'Fun Commands');
bot.registry.registerGroup('music', 'Music Commands' );
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.login(discord_token);

bot.on('message', function(message){

    const member = message.member;
    const mess = message.content.toLowerCase();
    const args = message.content.split(" ").splice(1).join(" ");

    if(mess.startsWith(prefix + "play")) {
        if (member.voiceChannel) {
            if (queue.length > 0 || isPlaying) {
                getID(args, function (id) {
                    add_to_queue(id);
                    youtubeInfo(id, function (err, videoInfo) {
                        if (err) throw new Error(err);
                        message.channel.send("**" + videoInfo.title + "** was added to queue")
                    });
                });
            } else {
                isPlaying = true;
                getID(args, function (id) {
                    queue.push("placeholder");
                    playMusic(id, message)
                    youtubeInfo(id, function (err, videoInfo) {
                        if (err) throw new Error(err);
                        message.channel.send("now playing **" + videoInfo.title + "**")
                    });
                });

            }
        }
    } else if (mess.startsWith(prefix + "skip")) {
        if (skippers.indexOf(message.author.id) === -1) {
            skippers.push(message.author.id);
            skipRequests++;
            if (skipRequests >= Math.ceil((voiceChannel.members.size - 1) / 2)) {
                skipMusic(message);
                message.channel.send("Skipping song");
            } else {
                message.channel.send("You need **" + Math.ceil(((voiceChannel.members.size - 1) / 2) - skipRequests) + "** more votes to skip the current song.");
            }
        } else {
            message.channel.send("You already voted to skip");
        }
    }

    if (mess.startsWith(prefix + "cd")) {
        var xmas = new Date("December 25, 2017 00:00:00");
        var test = new Date("November 25, 2017 19:17:00");
        var now = new Date();
        var timeDiff = xmas.getTime() - now.getTime();

        var seconds = Math.floor(timeDiff / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days =  Math.floor(hours / 24);
        hours %= 24;
        minutes %= 60;
        seconds %= 60;
        
        message.channel.send("There are **" + days + "** days **" + hours + "** hours **" + minutes + "** minutes **" + seconds + "** seconds until Christmas!");
    }

    if (mess.startsWith(prefix + "giftres")) {

        var steamCodeReese = "steam_code1";

        message.author.send("your steam code is: **" + steamCodeReese + "** Make sure to check your steam offers as well!");

    } else if (mess.startsWith(prefix + "giftgav")) {

        var steamCodeGavin = "steam_code2";
        
        message.author.send("your steam code is: **" + steamCodeGavin + "** Make sure to check your steam offers as well!");

    } else if (mess.startsWith(prefix + "giftwil")) {

        var steamCodeWill = "steam_code3";
        
        message.author.send("your steam code is: **" + steamCodeWill + "** Make sure to check your steam offers as well!");

    } else if (mess.startsWith(prefix + "giftcal")) {

        var steamCodeCaleb = "steam_code4";
        
        message.author.send("your steam code is: **" + steamCodeCaleb + "** Make sure to check your steam offers as well!");

    }
});

function skipMusic(message) {
    dispatcher.end();
    if (queue.length > 1) {
        playMusic(queue[0].message);
    } else {
        skipRequests = 0;
        skippers = [];
    }
}

function playMusic(id, message) {
    voiceChannel = message.member.voiceChannel;

    voiceChannel.join().then(function (connection) {
        stream = ytdl("https://www.youtube.com/watch?v=" + id, {
            filter: 'audioonly'
        });
        skipRequests = 0;
        skippers = [];

        dispatcher = connection.playStream(stream);
        dispatcher.on('end', function () {
            skipRequests = 0;
            skippers = [];
            queue.shift();
            if (queue.length == 0) {
                queue = [];
                isPlaying = false;
                voiceChannel.leave();
            }
        });
    });
}

function getID(str, cb) {
    if (isYoutube(str)) {
        cb(getYoutubeID(str));
    } else {
        search_video(str, function (id) {
            cb(id);
        });
    }
}

function add_to_queue(strID) {
    if (isYoutube(strID)){
        queue.push(getYoutubeID(strID));
    } else {
        queue.push(strID);
    }
}

function search_video(query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_API, function(error, response, body) {
        var json = JSON.parse(body);
        callback(json.items[0].id.videoId);
    });
}

function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com") > -1;
}

bot.on('ready', function() {
    console.log("Ready for Commands");

    // "Game is Playing" Message Vars
    var gamePlaying = new Array();

    gamePlaying[0] = "Decking the Halls";
    gamePlaying[1] = "Merry Christmas!";
    gamePlaying[2] = "Lighting the Tree";
    gamePlaying[3] = "Opening the Presents";
    gamePlaying[4] = "Pouring the Egg Nog";
    gamePlaying[5] = "Decorating the Tree";
    gamePlaying[6] = "Watching the Snow Fall";
    gamePlaying[7] = "Making Hot Chocolate";
    gamePlaying[8] = "Shopping for Presents";
    gamePlaying[9] = "Building a Snowman";
    gamePlaying[10] = "Wrapping the Gifts"; //TODO: add more christmas actions

    var length = gamePlaying.length;
    var whichGame = Math.floor(Math.random() * length);

    bot.user.setPresence({ game: { name: gamePlaying[whichGame], type: 0 } });
});