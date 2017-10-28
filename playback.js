const ytdl = require('ytdl-core');

module.exports = class Playback {
    constructor(streamOptions = { seek: 0, volume: 1 }) {
        this.streamOptions = streamOptions;
        this.playlist = new Array();
        this.playing = false;
    }

    play(client, connection) {
        const link = this.playlist.pop();

        this.stream = ytdl(link, { filter: 'audioonly' });
        const bc = client.createVoiceBroadcast();
        this.broadcast = bc.playStream(this.stream);
        connection.playBroadcast(this.broadcast);

        this.broadcast.once('end', () => {
            if (this.playlist.length > 0) {
                this.play(client, connection);
            }
            else {
                connection.disconnect();
                this.playing = false;
            }
        })
    }

    queue(link, message, client) {
        // verify given link and play it

        // Add the song to the playlist
        this.playlist.unshift(link);        

        if (this.playing) {
            message.channel.send("Added link to !queue, " + message.author);
        }
        else {
            message.member.voiceChannel.join()
                .then(connection => {
                    this.playing = true;
                    this.play(client, connection);
                    /*this.playlist.unshift(link);
                    while (this.playlist.length > 0) {
                        // Play the next song in queue
                        play(this.playlist.pop());
                        message.channel.send("Now playing: " + link);

                        this.broadcast.once('end', () => {
                            connection.disconnect();
                            this.playing = false;
                        });
                    }*/
                    // End playback if no one's listening
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
    }

    setVolume(val) {
        // Adjust volume to given parameter
    }

    getVolume() {
        // Return volume value
    }
}