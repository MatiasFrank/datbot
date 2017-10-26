/*
  Here come DatBot - oh shit waddup!
*/

// Link to GitHub repo
const github = 'https://github.com/kuff/datbot'

// Import the discord.js module
const Discord = require('discord.js');
// Import json files
const config = require('./settings.json');
const quotes = require('./quotes.json');
// Import ytdl to enable youtube playback
const ytdl = require('ytdl-core');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    // Defining emotes
    const ermin = client.emojis.find("name", "incest");

    // Switch between different cases
    switch(message.content) {
        
        case '!ping':
            // Pong the pinger!
            message.channel.send('pong');
            break; // Remember to break!

        case '!help':
            // Send a pm with a table of useful commands 
            // (find out how to format a table of useful commands)
            message.channel.send('Sent help!')
            message.author.sendMessage('Hope I\'m helping!');
            break;

        case '!code': // Nesting cases creates synonyms!
        case '!github': //(Because there are no break statements)
        case '!source':
            // Send a link to the source code
            message.channel.send('Thats right! You\'re welcome to add features to the bot, ' + message.author + ' - ' + github);
            break;

        case '!ermin':
            // Get a random quote by the man himself
            const random_choice = Math.ceil(Math.random()*quotes.ermin.amount)
            message.channel.send(`${ermin} ${quotes.ermin[random_choice]} ${ermin}`)
            break;
    }

    // Request a specific quote
    if (message.content.substring(0,6) === "!ermin" && message.content.length > 7) {
        const quote_index = parseInt(message.content.substring(7,8))
        message.channel.send(`${ermin} ${quotes.ermin[quote_index]} ${ermin}`)
    }

    // Playback songrequest
    if (message.content.substring(0,5) === "!play") {
        if (message.content.length > 5) {
            const link = message.content.substring(6);
            const streamOptions = { seek: 0, volume: 1 };
            const broadcast = client.createVoiceBroadcast();
        
            message.member.voiceChannel.join().then(connection => {
                const stream = ytdl(link, { filter: 'audioonly' });
                broadcast.playStream(stream);
                const dispatcher = connection.playBroadcast(broadcast);
                // Find a way to leave voice chat once breadcast has ended
            })
            .catch(console.error);
        }
        else {
            // Say something
        }
    }
});

// Log our bot in
client.login(token);