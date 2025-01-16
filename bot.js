const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
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
bot.loadPlugin('pathfinder')

    bot.on('login', () => {
        console.log('Bot has logged in!');
        bot.chat('Hello! I am now online.');

    

        checkTimeAndSleep(bot);
    });

    bot.on('time', () => {
        checkTimeAndSleep(bot); // Continuously check time to sleep if necessary
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return; // Ignore the bot's own messages
        console.log(`[${username}] ${message}`);
    });

    bot.on('end', () => {
        console.log('Bot has been disconnected. Reconnecting in 5 seconds...');
        setTimeout(createBot, 5000); // Recreate the bot instance
    });

    bot.on('error', (err) => console.log('Error:', err));
}

function checkTimeAndSleep(bot) {
    if (!bot.time) return; // Skip if time is not available yet

    const isNight = bot.time.timeOfDay >= 13000 && bot.time.timeOfDay <= 23000; // Nighttime range
    const bed = bot.findBlock({
        matching: block => block.name.includes('bed'), // Ensure proper bed detection
        maxDistance: 10
    });

    // Ensure the bot is not already sleeping
    if (bot.isSleeping) {
        console.log('Bot is already sleeping. Skipping sleep attempt.');
        return;
    }

    if (isNight && bed) {
        console.log('It is nighttime. Moving to bed...');
        bot.pathfinder.setGoal(new goals.GoalNear(bed.position.x, bed.position.y, bed.position.z, 1));
        
        bot.once('goal_reached', () => {
            bot.sleep(bed, (err) => {
                if (err) {
                    console.log('Failed to sleep:', err.message);
                } else {
                    console.log('Bot is now sleeping.');
                }
            });
        });
    } else if (!isNight) {
        console.log('It is not nighttime. Staying awake.');
    } else {
        console.log('No bed found nearby.');
    }
}

createBot();
