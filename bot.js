const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

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

        setInterval(()=>{
              moveRandomly(bot);
        },10000)
    });

    bot.on('time', () => {
        checkTimeandSleep(bot);
    });

    bot.on('end', () => {
        console.log('Bot disconnected. Reconnecting in 5 seconds...');
        setTimeout(createBot, 5000);
    });

    bot.on('error', (err) => {
        console.error('Error:', err);
    });
}
 // Function to find the nearest bed function 
 function findBed(bot) { const bedBlock = bot.findBlock({ matching: block => bot.isABed(block), maxDistance: 5  }); return bedBlock; } // Function to move to bed and sleep 
    function checkTimeAndSleep(bot) { if (bot.time.isNight) { const bed = findBed(bot); if (bed) { console.log('Found a bed! Moving towards it...'); bot.pathfinder.setGoal(new goals.GoalBlock(bed.position.x, bed.position.y, bed.position.z)); bot.once('goal_reached', () => { console.log('Bot reached the bed. Trying to sleep...'); bot.sleep(bed).catch(err => { console.log('Failed to sleep:', err.message); }); }); } else { console.log('No bed found nearby!'); } } } 

function moveRandomly(bot) {
    const x = bot.entity.position.x + (Math.random() * 2 - 1);  // Random movement within -1 to 1 blocks on X
    const y = bot.entity.position.y;  // Keep the same Y position (bot stays on the ground
    const z = bot.entity.position.z + (Math.random() * 2 - 1);  // Random movement within -1 to 1 blocks on Z

    // Move the bot to the new position within 2 blocks radius
    bot.pathfinder.setGoal(new goals.GoalNear(x, y, z, 0.5)); // Goal within a 0.5-block radius
}
createBot();
