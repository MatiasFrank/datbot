/**
 * help:
 * The table of available commands that is to be 
 * sent via dm to the requesting user with !help
 * 
 * playing:
 * The embed that is sent when a song starts playing
 */
module.exports = {
    help: link => {
        return {
            embed: {
                color: 3447003,
                author: {
                    name: "Help has arrived"
                },
                title: "View GitHub repo",
                url: link,
                description: "Feel free to suggest features or fork and make them yourself!",
                fields: [{
                    name: "!ping",
                    value: "Test the bot in selected channel. Retrives \"pong\" and some latency data."
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
                    name: "!volume { optional: Integer }",
                    value: "*Experimental:* Retrieves current playback volume if no parameter is specified. Else, sets volume to specified integer value. This value must be between 1 and 10 inclusive. You must be in the same voice channel as the bot to use this command and music has to be playing."
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
    playing: (data, playlist) => {

        const minutes = Math.floor(data.video.duration / 60);
        const seconds = data.video.duration % 60;

        const nextTitle = ((playlist.length != 0) ? playlist[0].video.title : "Nothing in queue! Do `!play { search query or YouTube link }` to add to it.");
        const nextChannel = ((playlist.length != 0) ? "\nby " + playlist[0].video.owner : "");
        const nextUser = ((playlist.length != 0) ? "\nsuggested by " + playlist[0].message.author : "");

        // Spaghetti code for inserting periods in view count
        // This took way too long to do...
        const views_number = data.video.views;
        const views_string = views_number.toString();
        let views = '';

        for (i = 0; 3 + i <= views_string.length;) {
            if (i > 0 || views_string.length % 3 == 0) {
                views += views_string.slice(i, 3 + i);
                i += 3;
            }
            else {
                views += views_string.slice(i, views_string.length % 3)
                i += views_string.length % 3;
            }
            views += '.';
        }
        views = views.substring(0, views.length - 1);

        return {
            embed: {
                title: data.video.title,
                description: data.description,
                url: data.video.url,
                color: 3447003,
                timestamp: data.timestamp,
                footer: {
                    icon_url: data.message.author.avatarURL,
                    text: "Requested by " + data.message.author.username
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
                        value: views,
                        inline: true
                    },
                    {
                        name: "Duration",
                        value: minutes + ":" + ((seconds < 10) ? "0" + seconds : seconds),
                        inline: true
                    },
                    {
                        name: "Up next:",
                        value: nextTitle + nextChannel + nextUser
                    }
                ]
            }
        };
    },
    queue: (data, playlist, time) => {

        const left_of_song = Math.floor(time.duration - ((Date.now() - global.time.timestamp)) / 1000);
        let playlist_time = 0;
        playlist.forEach( elem => {
            playlist_time += elem.video.duration;
        });
        const queue_time = left_of_song + playlist_time - data.video.duration;

        const minutes = Math.floor((queue_time) / 60);
        const seconds = (queue_time) % 60;

        return {
            embed: {
                title: data.video.title,
                description: `by ${data.video.owner}`,
                url: data.video.url,
                color: 3447003,
                thumbnail: {
                    url: data.video.thumbnailUrl
                },
                author: {
                    name: "Added to queue:"
                },
                fields: [
                    {
                        name: "Place in queue",
                        value: playlist.length,
                        inline: true
                    },
                    {
                        name: "Queue time",
                        value: "~ " + minutes + ":" + ((seconds < 10) ? "0" + seconds : seconds),
                        inline: true
                    }
                ]
            }
        }
    },
    ping: client => {
        return {
            embed: {
                color: 3447003,
                footer: {
                    text: "A heatbeat is sent every 45 seconds"
                },
                fields: [
                    {
                        name: "Latest heatbeat",
                        value: `${client.pings[0]} ms`,
                        inline: true
                    },
                    {
                        name: "Avarage:",
                        value: `${Math.round(client.ping)} ms`,
                        inline: true
                    }
                ]
            }
        }
    }
}