/*
  Here come DatBot - oh shit waddup!
*/

// Link to GitHub repo
const link = 'https://github.com/kuff/datbot'

// Import the discord.js module
const Discord = require('discord.js');

const jsonSize = require('json-size');

// Import json files
const config = require('./settings.json');
const quotes = require('./quotes.json');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.token

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('I am ready!');
});

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
            // Send a pm with a table of useful commands 
            // (find out how to format a table of useful commands)
            message.channel.send('Sent help!')
            message.author.sendMessage('Hope I\'m helping!');
            break;

        case '!code': // Nesting cases creates synonyms!
        case '!github': //(Because there are no break statements)
        case '!source':
            // Send a link to the source code
            message.channel.send('Thats right! You\'re welcome to add features to the bot, ' + message.author + ' - ' + link);
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
            console.log("Reacted!")
            const messages = message.channel.fetchMessages({limit: 5})
                .then((result) => {
                    //console.log(result);
                    result.forEach(message => {
                        //console.log(message);
                        message.react(ermin);
                    })
                });
            break;
    }
});

// Log our bot in
client.login(token);
