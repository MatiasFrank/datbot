const ytdl = require('ytdl-core');

module.exports = class Playback {
    constructor(client, streamOptions = { seek: 0, volume: 1 }) {
        this.client = client;
        this.streamOptions = streamOptions;
        this.playlist = new Array();
        this.playing = false;
    }

    end() {
        this.connection.disconnect();
        this.playing = false;
    }

    play() {
        const link = this.playlist.pop();

        this.stream = ytdl(link, { filter: 'audioonly' });
        const bc = this.client.createVoiceBroadcast();
        this.broadcast = bc.playStream(this.stream);
        this.connection.playBroadcast(this.broadcast);

        console.log("Playing music!");

        this.broadcast.once('end', () => {
            if (this.playlist.length > 0) {
                this.play();
            }
            else {
                this.end();
            }
        });
    }

    queue(link, message) {
        // Verify given link and play it

        // Verify using ytdl?

        // Add the song to the playlist
        this.playlist.unshift(link);        

        if (this.playing) {
            message.channel.send("Added link to !queue, " + message.author);
        }
        else {
            message.member.voiceChannel.join()
                .then(connection => {
                    // Join voice server and start jamming!
                    this.connection = connection;
                    this.playing = true;
                    this.play();
                });
        }
    }

    pause() {
        // Pause playback
        this.stream.pause();
        this.broadcast.pause();
    }

    resume() {
        // Resume playback
        this.stream.pause();
        this.broadcast.resume();
    }

    skip() {
        // Skip the current song being played
        // this.broadcast.end();
        this.play();
    }

    setVolume(val) {
        // Adjust volume to given parameter
    }

    getVolume() {
        // Return volume value
    }
}