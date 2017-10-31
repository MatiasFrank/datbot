const ytdl = require('ytdl-core');
const YouTube = require('youtube-node');
const config = require('./config.json');
const embeds = require('./embeds.js');

/**
 * Homemade module for handling streaming and 
 * playback of YouTube audio through Discord.js
 */
module.exports = class Playback {

    /**
     * @param {*} client 
     * @param {*} streamOptions 
     */
    constructor(client, streamOptions = { seek: 0, volume: 0.5, passes: 1, bitrate: 'auto' }) {
        this.client = client;
        this.streamOptions = streamOptions;
        this.playlist = [];
        this.playing = false;
        this.yt = new YouTube();
        this.yt.setKey(config.yt_key);
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
        this.stream = ytdl(data.url, { filter: 'audioonly' });
        const bc = this.client.createVoiceBroadcast();
        this.broadcast = bc.playStream(this.stream);
        this.dispatcher = this.connection.playBroadcast(this.broadcast);

        // Formatted "Now playing" message
        data.message.channel.send(embeds.playing(data));

        this.dispatcher.once('end', () => {
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

    search(link, message) {

        return new Promise( (resolve, reject) => {
            // Find song url. If song request is done with a link
            // the search will just yeild that video.
            this.yt.search(link, 5, (error, result) => {
                
                const video = result.items.find( (element) => {
                    return element.id.kind === 'youtube#video';
                });

                if (error) {
                    console.log("Error in queue: " + error);
                    reject(error);
                }
                else {
                    // Find everything
                    const url = 'https://youtube.com/watch?v=' + video.id.videoId;
                    const snippet = video.snippet;
    
                    /*console.log("result body: " + JSON.stringify(result));
                    console.log("Video url: " + JSON.stringify(url));
                    console.log("Video snippet: " + JSON.stringify(snippet));
                    console.log("Message: " + message);*/
    
                    resolve({
                        url:        url,
                        snippet:    snippet,
                        message:    message,
                        timestamp:  new Date()
                    });
                }
            });
        });
    }

    /**
     * Verifies given link and plays it
     * @param {*} link 
     * @param {*} message 
     */
    queue(link, message) {
        
        this.search(link, message).then(result => {
            // Add the song to the playlist
            this.playlist.push(result);
            
            if (this.playing) {
                // If we're already playing, tell the user 
                // that their song request was added to the queue
                message.reply("added link to !queue");
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
        });
    }

    /**
     * Pauses playback
     */
    pause() {
        this.stream.pause();
        this.broadcast.pause();
    }

    /**
     * Resumes playback
     */
    resume() {
        this.stream.pause(); // <- why tho
        this.broadcast.resume();
    }

    /**
     * Skips the current song being played
     */
    skip() {
        this.dispatcher.end();
    }

    /**
     * Adjusts volume to given parameter
     * @param {*} val 
     */
    setVolume(val) {
        // Code goes here...
    }
}