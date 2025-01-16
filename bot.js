const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder'); // Import pathfinder
const express = require('express');
const app = express();

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

    bot.loadPlugin(pathfinder); // Load the pathfinder plugin

    bot.on('login', () => {
        console.log('Bot has logged in!');
        bot.chat('Hello! I am now online.');

        // Set up movements
        const defaultMove = new Movements(bot, bot.world);
        bot.pathfinder.setMovements(defaultMove);

        // Start moving to a specific location
        const goal = new goals.GoalNear(10, 64, 10, 1); // Replace with desired coordinates
        bot.pathfinder.setGoal(goal);
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return; // Ignore the bot's own messages
        console.log(`[${username}] ${message}`);
    });

    bot.on('end', () => {
        console.log('Bot has been disconnected. Reconnecting in 5 seconds...');
        setTimeout(createBot, 5000); // Recreate the bot instance
    });

    // Handle sleep logic
    bot.on('playerUpdate', (player) => {
        if (player.username === bot.username) return; // Ignore the bot's own sleep status

        if (player.sleeping) {
            console.log('Player is sleeping, bot is stopping...');
            bot.pathfinder.setGoal(null); // Stop the bot from moving
        } else {
            console.log('Player is awake, bot is moving...');
            const goal = new goals.GoalNear(10, 64, 10, 1); // Replace with desired coordinates
            bot.pathfinder.setGoal(goal); // Set the goal again
        }
    });

    bot.on('error', (err) => console.log('Error:', err));
}

createBot();
