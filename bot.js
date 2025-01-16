const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// Example of bot logic (can be replaced with actual bot code)
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Bot is running on port ${port}`);
});



function createBot() {
    const bot = mineflayer.createBot({
        host: 'brotula.aternos.host', // Replace with your server's IP
        port: 55911, // Default port for Minecraft
        username: 'AfkSatvik', // Replace with the bot's username
        version: false // Specify version if needed (e.g., '1.19.3')
    });

    bot.on('login', () => {
        console.log('Bot has logged in!');
        bot.chat('Hello! I am now online.');

        setInterval(() => {
                bot.chat("Anju aunty xxx");
        },5000)
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return; // Ignore the bot's own messages
        console.log(`[${username}] ${message}`);
    });

    bot.on('end', () => {
        console.log('Bot has been disconnected. Reconnecting in 5 seconds...');
        setTimeout(createBot, 5000); // Recreate the bot instance
    });


    bot.on('playerUpdate', (player) => {
    if (player.sleeping) {
        // Pause bot actions while the player is sleeping
        bot.pause();
    } else {
        // Resume bot actions
        bot.resume();
    }
});
    bot.on('error', (err) => console.log('Error:', err));
}

createBot();
