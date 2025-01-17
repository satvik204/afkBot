const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Bot server is running on port ${port}`);
});

function createBot() {
    const bot = mineflayer.createBot({
        host: 'dragonsmp-sYzM.aternos.me', // Replace with your server's IP
        port: 55911, // Replace with your server's port
        username: 'AfkSatvik', // Bot's username
        version: false // Specify version if needed (e.g., '1.19.3')
    });



    bot.loadPlugin(pathfinder);

    bot.on('login', () => {
        console.log('Bot has logged in!');
        const defaultMove = new Movements(bot, bot.world);
        bot.pathfinder.setMovements(defaultMove);

        // Move randomly every 3 seconds (only at night)
        setInterval(() => moveRandomly(bot), 3000);
    });

    // Correctly listen for time changes
    bot.on('time', () => {checkTimeAndSleep(bot);
                             console.log(bot.time);
                              console.log(bot.world.time);
                         });
    app.get('/', (req, res) => {
    res.send(`Bot is running! `);

});
    bot.on('end', () => {
        console.log('Bot disconnected. Reconnecting in 5 seconds...');
        setTimeout(createBot, 5000);
    });

    bot.on('error', (err) => {
        console.error('Error:', err);
    });
}

// Function to find the nearest bed
function findBed(bot) {
    return bot.findBlock({
        matching: block => block.name.includes('bed'), // Corrected bed detection
        maxDistance: 5  // Look for a bed within 5 blocks
    });
}

// Function to move to bed and sleep
function checkTimeAndSleep(bot) {
    if (!bot || !bot.time || bot.time.day === undefined) {
        console.log("Bot or bot.time is not ready! Skipping sleep check.");
        return;
    }

    if (bot.time.day >= 12000) {
        const bed = findBed(bot);

        if (bed) {
            console.log('Found a bed! Moving towards it...');
            bot.pathfinder.setGoal(new goals.GoalBlock(bed.position.x, bed.position.y, bed.position.z));

            bot.once('goal_reached', () => {
                console.log('Bot reached the bed. Trying to sleep...');
                bot.sleep(bed).catch(err => {
                    console.log('Failed to sleep:', err.message);
                });
            });
        } else {
            console.log('No bed found nearby!');
        }
    } else {
        console.log('It is daytime. No need to sleep.');
    }
}

// Function to move randomly within a 2-block radius at night
function moveRandomly(bot) {
    if (!bot.time.isNight) return; // Only move at night

    const x = bot.entity.position.x + (Math.random() * 2 - 1); // Move -1 to 1 blocks in X
    const z = bot.entity.position.z + (Math.random() * 2 - 1); // Move -1 to 1 blocks in Z

    bot.pathfinder.setGoal(new goals.GoalNear(x, bot.entity.position.y, z, 0.5)); // Move to the random spot
}

// Start the bot
createBot();
