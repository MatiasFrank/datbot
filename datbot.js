/*
  Here come DatBot - oh shit waddup!
*/

// Various imports
const Discord = require('discord.js'); // Import the discord.js module
const config = require('./settings.json'); // Import json files
const quotes = require('./quotes.json');
const ytdl = require('ytdl-core'); // Import ytdl to enable youtube playback

// Link to GitHub repo
const github = 'https://github.com/kuff/datbot'

// The token of the bot - https://discordapp.com/developers/applications/me
const token = config.token;

// Create an instance of a Discord client
const client = new Discord.Client();

// The ready event is vital, it means that tbe bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('I am ready!');
});

// React to a given message with a given emote. If a limit greater than 1 is specified,
// previous messages in the thread will also recieve a reaction
function react (message, emote, limit) {
    message.channel.fetchMessages({limit: limit})
        .then((result) => {
            result.forEach(message => {
                message.react(emote);
            })
        });
}

// Create an event listener for messages
client.on('message', message => {
    // Defining emotes here
    const ermin = client.emojis.find("name", "incest");

    // Find words in the message
    const words = message.content.split(" ");
    //console.log("Words in message: " + words)

    // Switch between different cases
    switch(words[0]) {
        
        case '!ping':
            // Pong the pinger!
            message.channel.send('pong');
            break; // Remember to break!

        case '!help':
            // Send a pm with a table of available commands
            message.channel.send('Sent help!')
            message.author.sendMessage({embed: {
                color: 3447003,
                author: {
                    name: "Help has arrived!",
                    icon_url: client.user.avatarURL
                },
                title: "GitHub repo",
                url: github,
                description: "Feel free to suggest features or fork and make a pull request!",
                fields: [{
                    name: "!ping",
                    value: "Test the bot in selected channel. Retrives \"pong\"."
                },
                {
                    name: "!help",
                    value: "The command you just typed! Learn about all available commands.",
                },
                {
                    name: "!code, !github, !source",
                    value: "Retrives a link to the github repo."
                },
                {
                    name: "!ermin",
                    value: "Retrives a random Ermin quote."
                },
                {
                    name: "!ermin { Integer }",
                    value: "Retrives a specific Ermin quote, specified by an integer value."
                }],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "!help @ DatBot :*"
                }
            }});
            break;

        case '!code': // Nesting cases creates synonyms!
        case '!github': //(Because there are no break statements)
        case '!source':
            // Send a link to the source code
            message.channel.send('Thats right! You\'re welcome to add features to the bot, ' + message.author + ' - ' + github);
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
            if (words[1] != undefined) {
                // If a link is given, play it
                const link = words[1];
                const streamOptions = { seek: 0, volume: 1 };
                const broadcast = client.createVoiceBroadcast();
            
                message.member.voiceChannel.join()
                    .then(connection => {
                        const stream = ytdl(link, { filter: 'audioonly' });

                        broadcast.playStream(stream);
                        connection.playBroadcast(broadcast);

                        broadcast.once('end', () => {
                            connection.disconnect();
                        });
                    })
                    .catch(console.error);
            }
            else {
                // handle incorrect input - no link specified
            }
        
        case '!volume':
            // Changes volume to specified value if integer value is specified,
            // else return value
            break;
        
        case '!pause':
            // Pause playback
            // Some logic
            broadcast.pause();
            break;
        
        case '!resume':
            // Resume playback
            // Some logic
            broadcast.resume();
            break;
        
        case '!queue':
            // Queue song passed as link
            // Show queued songs when no parameters are specified
            break;
        
        case '!skip':
            // Skip song currently playing and play next in queue
            break;
    }

    words.find((elem) => {
        if (elem === "incest" || elem === "søster") {
            // If any sentence mentions "incest" or "søster", react with Ermin's face
            react(message, ermin, 1);
        }
        // Add handlers for other mentions here
    });
});

// Log our bot in
client.login(token);