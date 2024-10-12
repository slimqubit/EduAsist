const cron = require('node-cron');
const { generateStockSnapshots } = require('../services/stockService');

// Programez cron job-ul pentru ultima zi din fiecare luna, la miezul noptii
cron.schedule('0 0 28-31 * *', async () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    if (today.getDate() === lastDayOfMonth) {
        console.log('Running stock snapshot generation...');
        await generateStockSnapshots();
    }
});