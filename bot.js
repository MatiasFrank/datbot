/*
  Here come DatBot - oh shit waddup!
*/

// Various imports
const Discord = require('discord.js'); // Import the discord.js module
const Playback = require('./playback.js'); // Import our own player
const config = require('./config.json'); // Import json files
const quotes = require('./quotes.json');
const embeds = require('./embeds.js');

// Instanciate classes
const client = new Discord.Client(); // Create an instance of a Discord client
const pb = new Playback(client); // Create an instance of our player

// The ready event is vital, it means that tbe bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('I am ready!');
});

/**
 * React to a given message with a given emote. 
 * If a limit greater than 1 is specified, previous messages 
 * in the thread will also recieve a reaction
 * @param {*} message 
 * @param {*} emote 
 * @param {*This should be at least 1} limit 
 */
function react (message, emote, limit) {
    message.channel.fetchMessages({limit: limit})
        .then((result) => {
            result.forEach(message => {
                message.react(emote);
            })
        });
}

/**
 * Determines if a member is connected to the 
 * same voice connection as the bot
 * @param {*} member 
 */
function inVoice(member) {
    const map = member.voiceChannel.members;
    const array = Array.from(map.keys());
    return array.includes(config.id);
}

// Create an event listener for messages
client.on('message', message => {
    // Defining emotes here
    const ermin = client.emojis.find("name", "incest");

    // Find words in the message
    const words = message.content.split(" ");

    // Switch between different cases
    switch(words[0]) {
        
        case '!ping':
            // Pong the pinger!
            message.channel.send('pong');
            break; // Remember to break!

        case '!help':
            // Send a pm with a table of available commands
            message.author.send(embeds.help());
            break;

        case '!code': // Nesting cases creates synonyms!
        case '!github': //(Because there are no break statements)
        case '!source':
            // Send a link to the source code
            message.channel.send('Thats right! You\'re welcome to add features to the bot, ' + message.author + ' - ' + config.link);
            break;

        case '!ermin':
            // Quote the man himself
            if (words[1] != undefined) {
                // Is a specific quote being requested?
                if (quotes.ermin[words[1]] != undefined) {
                    message.channel.send(`${ermin} ${quotes.ermin[words[1]]} ${ermin}`)
                }
                else {
                    // Handling invalid inputs
                    if (quotes.ermin.amount < words[1]) {
                        message.channel.send("Error: We do not have that many ermin quotes... yet!");
                    }
                    else {
                        message.channel.send("Error: Unexpected input. Try: >> !ermin { Integer } <<");
                    }
                }
            }
            else {
                // If no specific quote is being requested, choose one at random
                const random_choice = Math.ceil(Math.random()*quotes.ermin.amount)
                message.channel.send(`${ermin} ${quotes.ermin[random_choice]} ${ermin}`)
            }
            break;
        
        case '!react':
            // React with Ermin's face on the last five messages posted
            react(message, ermin, 5);
            break;
        
        case '!play':
            // Playback link passed as parameter
            if (message.member.voiceChannel != undefined) {

                if (words[1] != undefined) {
                    // Pass parameter given to queue
                    const link = words.splice(1,words.length - 1);
    
                    // Start playing
                    pb.queue(link, message);
                }
                else {
                    message.reply(`you must specify a valid YouTube link!`);
                    // Suggestion with formatting
                }
            }
            else {
                // handle incorrect input - no link specified
                message.reply(`you must be in a voice channel to listen to music!`);
            }
            break;
        
        case '!volume':
            // Changes volume to specified value if integer value 
            // is specified, else return value
            if (inVoice(message.member)) {
                // The codezz
            }
            break;
        
        case '!pause':
            // Pause playback
            if (inVoice(message.member)) {
                pb.pause();
            }
            break;
        
        case '!resume':
            // Resume playback
            if (inVoice(message.member)) {
                pb.resume();
            }
            break;
        
        case '!queue':
            // Retrived all queued songs
            // Format print: https://leovoel.github.io/embed-visualizer/
            break;
        
        case '!skip':
            // Skip song currently playing and play next in queue
            if (inVoice(message.member)) {
                pb.skip();
            }
            break;
    }

    words.find(elem => {
        if (elem === "incest" || elem === "søster") {
            // If any sentence mentions "incest" or "søster", react with Ermin's face
            react(message, ermin, 1);
        }
        // Add handlers for other mentions here
    });
});

client.on('voiceStateUpdate', member => {
    // Broken
    if (member.voiceChannel != undefined) {

        const map = member.voiceChannel.members;
        //const array = Array.from(map.keys());
        
        if(pb.playing && map.size == 1 && inVoice(member)) {
            // Disconnect from voice chat if no one's listening
            pb.terminate();
        }
    }
})

// Log our bot in with
// the token of the bot - 
// https://discordapp.com/developers/applications/me
client.login(config.token);