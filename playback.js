const ytdl = require('ytdl-core');

module.exports = class Playback {
    constructor(streamOptions = { seek: 0, volume: 1 }) {
        this.streamOptions = streamOptions;
        this.playlist = Array();
        this.playing = false;
    }

    queue(link, message, client) {
        // verify given link and play it
        message.member.voiceChannel.join()
            .then(connection => {

                this.stream = ytdl(link, { filter: 'audioonly' });
                const bc = client.createVoiceBroadcast();

                this.broadcast = bc.playStream(this.stream);
                connection.playBroadcast(this.broadcast);

                this.broadcast.once('end', () => {
                    // When a song finishes playing
                    // Handle queue
                    connection.disconnect();
                });

                // End playback if no one's listening
            });
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
    }

    setVolume(val) {
        // Adjust volume to given parameter
    }

    getVolume() {
        // Return volume value
    }
}