/*
  Here come DatBot - oh shit waddup!
*/

// Link to GitHub repo
const link = 'https://github.com/kuff/datbot'

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzcyODE3MTgwNTIzMjMzMjgw.DNJtJw.jqVrvYwJcGE6FgJodtRHy8ssCjQ';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
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
        case '!contribute':
        case '!source':
            // Send a link to the source code
            message.channel.send('Here ye go, ' + message.author + ' - ' + link);
            break;
           case '!ermin':
                const ermin = client.emojis.find("name", "incest");
           switch(Math.ceil(Math.random()*10)) {
             case 1: 
               message.channel.send(`${ermin} Drenge, skal vi ikke spille noget minecraft? ${ermin}`);
               break; // Remember to break!
             case 2: 
               message.channel.send(`${ermin} Pokémon, jeg vælger dig! ${ermin}`);
               break; // Remember to break!
             case 3: 
               message.channel.send(`${ermin} <blank> ${ermin}`);
               break; // Remember to break!
             case 4: 
               message.channel.send(`${ermin} <blank2> ${ermin}`);
               break; // Remember to break!
             case 5: 
               message.channel.send(`${ermin} <blank3> ${ermin}`);
               break; // Remember to break!
             case 6: 
               message.channel.send(`${ermin} <blank4> ${ermin}`);
               break; // Remember to break!
             case 7: 
               message.channel.send(`${ermin} <blank5> ${ermin}`);
               break; // Remember to break!
             case 8: 
               message.channel.send(`${ermin} <blank6> ${ermin}`);
               break; // Remember to break!
             case 9: 
               message.channel.send(`${ermin} <blank7> ${ermin}`);
               break; // Remember to break!
             case 10: 
               message.channel.send(`${ermin} <blank8> ${ermin}`);
               break; // Remember to break!
           }
           break; // Remember to break!
    }
});

// Log our bot in
client.login(token);
