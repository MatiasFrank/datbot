const config = require('./config.json');

/**
 * help:
 * The table of available commands that is to be 
 * sent via dm to the requesting user with !help
 * 
 * playing:
 * The embed that is sent when a song starts playing
 */
module.exports = {
    help: () => {
        return {
            embed: {
                color: 3447003,
                author: {
                    name: "!help has arrived"
                },
                title: "View GitHub repo for full list of available commands",
                url: config.link,
                description: "Feel free to suggest features or fork and make a pull request!",
                fields: [{
                    name: "!ping",
                    value: "Test the bot in selected channel. Retrives \"pong\"."
                },
                {
                    name: "!code, !github, !source",
                    value: "Retrives a link to the github repo."
                },
                {
                    name: "!play <Search query, YouTube link>",
                    value: "Searches youtube for given parameter, then initiates playback of first video found. You must be in a voice channel to use this command."
                },
                {
                    name: "!skip",
                    value: "Skips the song currently playing."
                },
                {
                    name: "!pause",
                    value: "Pauses playback. You must be in the same voice channel as the bot to use this command and music has to be playing."
                },
                {
                    name: "!resume",
                    value: "Resumes playback. You must be in the same voice channel as the bot to use this command and music has to be playing."
                },
                /*{
                    name: "!volume <Integer>",
                    value: "Sets playback volume to given parameter. Must be between 1 and 100. You must be in the same voice channel as the bot to use this command and music has to be playing."
                },*/
                {
                    name: "!queue",
                    value: "Retrieves a list of queued songs."
                }],
                timestamp: new Date(),
                footer: {
                    text: "!help @ DatBot :*"
                }
            }
        };
    },
    playing: function(data) {
        return {
            content: data.message.author + ", currently playing:",
            embed: {
                title: data.snippet.title,
                description: data.snippet.description,
                url: data.url,
                color: 3447003,
                timestamp: data.timestamp,
                footer: {
                    icon_url: data.message.author.avatarURL,
                    text: "requested by " + data.message.author
                },
                image: {
                    url: data.snippet.thumbnails.default.url
                },
                author: {
                    name: data.snippet.channelTitle,
                }
            }
        };
    }
}