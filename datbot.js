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
            message.channel.send('Thats right! You\'re welcome to add features to the bot, ' + message.author + ' - ' + link);
            break;

        case '!ermin':
            // Quote the man himself
            const random_choice = Math.ceil(Math.random()*quotes.ermin.amount)
            message.channel.send(`${ermin} ${quotes.ermin[random_choice]} ${ermin}`)
            break;
    }

    if (message.content.substring(0,6) === "!ermin" && message.content.length > 7) {
        const quote_index = parseInt(message.content.substring(7,8))
        message.channel.send(`${ermin} ${quotes.ermin[quote_index]} ${ermin}`)
    }
    if (message.content.substring(0,6) === "!react") {
        const messages = message.channel.fetchMessages({limit: 5});
        for (i = 0; i < messages.length; i++) {
            messages[i].react(client.emojis.find("name", "incest"));
        }
    }
    
    }
});

// Log our bot in
client.login(token);
