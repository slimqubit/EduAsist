const { Product, StockMovement, StockSnapshot } = require('../models/stock.models'); // Adjust paths as needed

async function generateStockSnapshots() {
    try {
        const products = await Product.findAll();
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the current month

        for (const product of products) {
            const [startingMovement] = await StockMovement.findAll({
                where: {
                    productId: product.id,
                    movementDate: { [Sequelize.Op.lt]: monthStart },
                },
                order: [['movementDate', 'DESC']],
                limit: 1,
            });

            let startingQuantity = startingMovement ? startingMovement.quantity : 0;

            const movements = await StockMovement.findAll({
                where: {
                    productId: product.id,
                    movementDate: { [Sequelize.Op.between]: [monthStart, monthEnd] },
                },
                order: [['movementDate', 'ASC']],
            });

            let endingQuantity = startingQuantity;
            for (const movement of movements) {
                if (movement.movementType === 'IN') {
                    endingQuantity += movement.quantity;
                } else if (movement.movementType === 'OUT') {
                    endingQuantity -= movement.quantity;
                }
            }

            await StockSnapshot.create({
                snapshotDate: monthEnd,
                startingQuantity,
                endingQuantity,
                productId: product.id,
            });
        }
        console.log('Stock snapshots generated successfully.');
    } catch (error) {
        console.error('Error generating stock snapshots:', error);
    }
}

module.exports = { generateStockSnapshots };
