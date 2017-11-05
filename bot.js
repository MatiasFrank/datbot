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
function react (message, emote, limit = 1) {
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
    try {
        const map = member.voiceChannel.members;
        const array = Array.from(map.keys());
        return array.includes(config.id);
    }
    catch (error) {
        return false;
    }
}

/**
 * Do something if a message contains a substring 
 * of one of the specified triggers
 * @param {*A message!} message 
 * @param {*An array!} trigger 
 * @param {*A function!} callback 
 */
function scan(message, trigger, func) {
    for (let t = 0; t < trigger.length; t++) {
        if (message.content.indexOf(trigger[t]) !== -1) {
            return func();
        }
    }
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
            message.reply('pong!');
            message.channel.send(embeds.ping(client));
            break; // Remember to break!

        case '!help':
            // Send a pm with a table of available commands
            message.author.send(embeds.help(config.link));
            break;

        case '!code': // Nesting cases creates synonyms!
        case '!github': //(Because there are no break statements)
        case '!source':
            // Send a link to the source code
            message.channel.send(`Thats right, ${message.author} !\nYou\'re welcome to add features to the bot - ${config.link}`);
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
                        message.channel.send(`I do not know that many ermin quotes, ${message.author} !`);
                    }
                    else {
                        message.channel.send("You must specify an Integer value, " + message.author + " !\nTry: `!ermin { Integer }`");
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
            try {
                if (message.member.voiceChannel != undefined) {
    
                    if (words[1] != undefined) {
                        // Pass parameter given to queue
                        const query = words.splice(1, words.length - 1).join(' ');
        
                        // Start playing
                        pb.queue(query, message);
                    }
                    else {
                        message.channel.send(`You must specify a valid YouTube link or search query, ${message.author} !`);
                        // Suggestion with formatting
                    }
                }
                else {
                    // handle incorrect input - no link specified
                    message.channel.send(`You must be in a voice channel as me to listen to music, ${message.author} !`);
                }
            }
            catch (error) {
                console.log(error);
                message.channel.send(`I'm terribly sorry but I simply cannot do that, ${message.author} !`);
            }
            break;
        
        case '!volume':
            // Changes volume to specified value if integer value 
            // is specified, else return volume in db
            if (pb.playing && !pb.paused) {

                if (words[1]) {

                    if (inVoice(message.member)) {
    
                        if (words[1] < 11 && words[1] > 0) {

                            try {
                                pb.setVolume(words[1]);
                            }
                            catch (error) {
                                message.channel.send(`Invalid input, expected Integer, ${message.author}`);
                            }
                        }
                        else {
                            message.channel.send('The integer value specified must be between 1 and 10 inclusive, ' + message.author + " !");
                        }
                    }
                    else {
                        message.channel.send(`You must be in the same voice channel as me to issue voice commands, ${message.author} !`);
                    }
                }
                else {
                    message.channel.send("The current playback volume is " + pb.getVolume() + "/10. To change this, do `!volume { Integer }`, where the integer value is between 1 and 10 inclusive, " + message.author + " !");
                }
            }
            else {
                message.channel.send(`You must be listening to music in order to change the volume, ${message.author} !`);
            }
            break;
        
        case '!pause':
            // Pause playback
            if (inVoice(message.member) && pb.playing && !pb.paused) {
                pb.pause();
            }
            else {
                message.reply("you must be in the same voice channel as me and the music must be playing!")
            }
            break;
        
        case '!resume':
            // Resume playback
            if (inVoice(message.member) && pb.playing && pb.paused) {
                pb.resume();
            }
            else {
                message.reply("you must be in the same voice channel as me and the music must be paused!")
            }
            break;
        
        case '!playlist':
        case '!queue':
            // Retrived all queued songs
            // Format print: https://leovoel.github.io/embed-visualizer/
            break;
        
        case '!skip':
            // Skip song currently playing and play next in queue
            if (inVoice(message.member) && pb.playing) {
                pb.skip();
            }
            else {
                message.reply("nothing to skip!")
            }
            break;

        case '!remaining':
            // Retrieves the time remaining of 
            // the song currently playting
            if (pb.playing) {
                pb.remaining(message);
            }
            else {
                message.channel.send(`There's no music playing, ${message.author} !`);
            }
    }

    scan(message, 
        ["incest", "ermin", "søster"], 
        () => react(message, ermin));

    scan(message, 
        ["fuck", "shit", "lort", "røvhul"],
        () => message.reply("tal ordenligt!"));
    
    // Add handlers for other mentions here
});

client.on('voiceStateUpdate', member => {
    
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