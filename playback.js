const ytdl = require('ytdl-core');

/**
 * Homemade module for handling streaming and playback of 
 * YouTube audio through Discord.js
 */
module.exports = class Playback {

    /**
     * @param {*} client 
     * @param {*} streamOptions 
     */
    constructor(client, streamOptions = { seek: 0, volume: 1 }) {
        this.client = client;
        this.streamOptions = streamOptions;
        this.playlist = new Array();
        this.playing = false;
    }

    /**
     * Terminates voice connection
     */
    end() {
        this.connection.disconnect();
        this.playing = false;
    }

    /**
     * Plays next song in queue
     */
    play() {
        // Get next link in queue
        const link = this.playlist.shift();
        console.log("Playlist link: " + link);
        console.log("Playlist play: " + this.playlist);        

        // Initiate playback
        this.stream = ytdl(link, { filter: 'audioonly' });
        const bc = this.client.createVoiceBroadcast();
        this.broadcast = bc.playStream(this.stream);
        this.dispatcher = this.connection.playBroadcast(this.broadcast);

        console.log("Playing music!");

        this.dispatcher.once('end', () => {
            // When the song ends either play next in playlist 
            if (this.playlist.length > 0) {
                bc.end();
                this.play();
            }
            // or terminate voice connection
            else {
                this.end();
            }
        });
    }

    /**
     * Verifies given link and plays it
     * @param {*} link 
     * @param {*} message 
     */
    queue(link, message) {
        // Verify using ytdl?

        // Add the song to the playlist
        this.playlist.push(link);
        console.log("Playlist queue: " + this.playlist);

        if (this.playing) {
            // If we're already playing, tell the user 
            // that their song request was added to the queue
            message.channel.send("Added link to !queue, " + message.author);
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
        this.stream.pause();
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

    /**
     * Returns volume value
     */
    getVolume() {
        // Code goes here...
    }
}