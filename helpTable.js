/**
 * The table of available commands that is to be 
 * sent via dm to the requesting user with !help
 */
module.exports = github => {
    return {
        color: 3447003,
        author: {
            name: "!help has arrived!"
        },
        title: "GitHub repo",
        url: github,
        description: "Feel free to suggest features or fork and make a pull request!",
        fields: [{
            name: "!ping",
            value: "Test the bot in selected channel. Retrives \"pong\"."
        },
        {
            name: "!help",
            value: "The command you just typed! Learn about all available commands.",
        },
        {
            name: "!code, !github, !source",
            value: "Retrives a link to the github repo."
        },
        {
            name: "!ermin",
            value: "Retrives a random Ermin quote."
        },
        {
            name: "!ermin { Integer }",
            value: "Retrives a specific Ermin quote, specified by an integer value."
        },
        {
            name: "!react",
            value: "React with Ermin's face on the last five messages posted in the channel."
        }],
        timestamp: new Date(),
        footer: {
            text: "!help @ DatBot :*"
        }
    };
}