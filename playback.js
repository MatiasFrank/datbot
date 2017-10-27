const ytdl = require('ytdl-core');

module.exports = class Playback {
    constructor(streamOptions = { seek: 0, volume: 1 }) {
        this.streamOptions = streamOptions;
        this.queue = {};
    }

    play(link, message, client) {
        // Playback given link
        if (message.member.voiceChannel != undefined) {
            // If the requesting user is in a voice channel
            message.member.voiceChannel.join()
            .then(connection => {

                this.stream = ytdl(link, { filter: 'audioonly' });
                const bc = client.createVoiceBroadcast();

                this.broadcast = bc.playStream(this.stream);
                connection = connection.playBroadcast(this.broadcast);

                this.broadcast.once('end', () => {
                    // When a song finishes playing
                    // Handle queues
                        connection.disconnect();
                });
            });
        }
        else {
            // If the user is not in a voice channel, report the error to them
            message.channel.send(`Error: You must be in a voice channel to listen to music, ${message.author} !`);
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
    }

    setVolume(val) {
        // Adjust volume to given parameter
    }

    getVolume() {
        // Return volume value
    }
}