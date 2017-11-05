// We import stuff here
const ytdl = require('ytdl-core');
const YouTube = require('youtube-node');
const config = require('./config.json');
const embeds = require('./embeds.js');
const fetch = require('youtube-info');

/**
 * Homemade module for handling streaming and 
 * playback of YouTube audio through Discord.js
 */
module.exports = class Playback {

    /**
     * @param {*} client 
     * @param {*} streamOptions 
     */
    constructor(client)
    {
        this.client = client;
        this.playlist = [];
        this.playing = false;
        this.paused = false;
        this.yt = new YouTube();
        this.yt.setKey(config.yt_key);
        this.volume = 0.15;
    }

    /**
     * Terminates voice connection
     */
    terminate() {
        this.connection.disconnect();
        this.playing = false;
    }

    /**
     * Plays next song in queue
     */
    play() {
        // Get next link in queue
        const data = this.playlist.shift();
        
        // Initiate playback
        this.stream = ytdl(data.video.url, { filter: 'audioonly' });
        const bc = this.client.createVoiceBroadcast();
        this.broadcast = bc.playStream(this.stream);
        this.connection.playBroadcast(this.broadcast);
        this.broadcast.setVolume(this.volume)
        
        // Send a formatted "Now playing" message
        const embed = embeds.playing(data, this.playlist);
        data.message.channel.send(embed);

        // Update song length
        global.time = {
            duration: data.video.duration,
            timestamp: new Date()
        };

        this.broadcast.once('end', () => {
            // When the song ends either play next in playlist 

            if (this.playlist.length > 0) {
                // Now playing...
                this.play();
            }
            else {
                // Or terminate voice connection
                this.terminate();
            }
        });
    }

    search(query, message) {

        return new Promise( (resolve, reject) => {
            // Find song url. If song request is done with a link
            // the search will just yeild that video.
            this.yt.search(query, 5, (error, result) => {
                
                if (error) {
                    console.log(error);
                    reject(error);
                }

                try {
                    const video = result.items.find( (element) => {
                        return element.id.kind === 'youtube#video';    
                    });
                    fetch(video.id.videoId).then( (data) => {

                        resolve({
                            video:          data,
                            description:    video.snippet.description,
                            message:        message,
                            timestamp:      new Date()
                        })
                    });
                }
                catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    /**
     * Verifies given link and plays it
     * @param {*} link 
     * @param {*} message 
     */
    queue(query, message) {
        
        this.search(query, message).then(result => {
            // Add the song to the playlist
            this.playlist.push(result);
            
            if (this.playing) {
                // If we're already playing, tell the user 
                // that their song request was added to the queue
                message.channel.send(embeds.queue(result, this.playlist, global.time));

            }
            else {
                // if not, join voice channel and start jamming!
                message.member.voiceChannel.join()
                    .then(connection => {
                        this.connection = connection;
                        this.playing = true;
                        this.play();
                    });
            }
        }, err => {
            // Tell the user about this!!
            message.channel.send(`Could not find any video that had anything to do with \"${query}\", ${message.author} !`);
        });
    }

    /**
     * Pauses playback
     */
    pause() {
        this.broadcast.pause();
        this.paused = true;
    }

    /**
     * Resumes playback
     */
    resume() {
        this.broadcast.resume();
        this.paused = false;
    }

    /**
     * Skips the current song being played
     */
    skip() {
        this.broadcast.end();
    }

    /**
     * Retrieves current playback volume
     */
    getVolume() {
        return this.broadcast.volume * 20;
    }

    /**
     * Adjusts volume to given parameter
     * @param {*} val 
     */
    setVolume(val) {
        this.volume = val / 20;
        this.broadcast.setVolume(this.volume);
    }

    /**
     * Retrieves the time remaining of the song currently playing
     */
    remaining(message) {
        const embed = embeds.remaining(global.time, this.playlist);
        message.channel.send(embed);
    }
}