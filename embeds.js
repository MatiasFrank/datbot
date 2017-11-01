// The importz
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
                    name: "Help has arrived"
                },
                title: "View GitHub repo",
                url: config.link,
                description: "Feel free to suggest features or fork and make them yourself!",
                fields: [{
                    name: "!ping",
                    value: "Test the bot in selected channel. Retrives \"pong\"."
                },
                {
                    name: "!code, !github, !source",
                    value: "Retrives a link to the github repo."
                },
                {
                    name: "!ermin { optional: integer }",
                    value: "Retrives a specific quote indexed by an integer value, else return a random Ermin's quote if no integer parameter is specified."
                },
                {
                    name: "!react",
                    value: "React with Ermin's face on the last five messages posted in the channel."
                },
                {
                    name: "!play { search query or YouTube link }",
                    value: "*Experimental:* Searches YouTube for given parameter, then initiates playback of first video found. You must be in a voice channel to use this command. If a song is already playing, the requested song is added to the queue."
                },
                {
                    name: "!skip",
                    value: "*Experimental:* Skips the song currently playing. You must be in the same voice channel as the bot to use this command and music has to be playing."
                },
                {
                    name: "!pause",
                    value: "*Experimental:* Pauses playback. You must be in the same voice channel as the bot to use this command and music has to be playing."
                },
                {
                    name: "!resume",
                    value: "*Experimental:* Resumes playback. You must be in the same voice channel as the bot to use this command and music has to be paused."
                }/*,
                {
                    name: "!volume <Integer>",
                    value: "Sets playback volume to given parameter. Must be between 1 and 100. You must be in the same voice channel as the bot to use this command and music has to be playing."
                },
                {
                    name: "!queue, !playlist",
                    value: "*Experimental:* Retrieves a list of queued songs."
                }*/],
                timestamp: new Date(),
                footer: {
                    text: "!help @ DatBot :*"
                }
            }
        };
    },
    playing: function(data, playlist) {
        const minutes = Math.floor(data.video.duration / 60);
        const seconds = data.video.duration % 60;
        const nextTitle = ((playlist.length != 0) ? playlist[0].video.title : "Nothing in queue! Do `!play { search query or YouTube link }` to add to it.");
        const nextChannel = ((playlist.length != 0) ? "\nby " + playlist[0].video.owner : "");
        const nextUser = ((playlist.length != 0) ? "\nsuggested by " + playlist[0].message.author : "");
        return {
            content: data.message.author + ", now playing:",
            embed: {
                title: data.video.title,
                description: data.description,
                url: data.video.url,
                color: 3447003,
                timestamp: data.timestamp,
                footer: {
                    icon_url: data.message.author.avatarURL,
                    text: "requested by " + data.message.author
                },
                thumbnail: {
                    url: data.video.thumbnailUrl
                },
                author: {
                    name: data.video.owner
                },
                fields: [
                    {
                        name: "Views",
                        value: data.video.views,
                        inline: true
                    },
                    {
                        name: "Duration",
                        value: minutes + ":" + ((seconds < 10) ? "0" + seconds: seconds),
                        inline: true
                    },
                    {
                        name: "Up next:",
                        value: nextTitle + nextChannel + nextUser
                    }
                ]
            }
        };
    }
}