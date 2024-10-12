
const Sequelize = require("sequelize");
const sequelize = require('./database.js'); // Conexiunea la baza de date

const school_models = require("./school.models.js")(sequelize, Sequelize);
const type_models = require("./type.models.js")(sequelize, Sequelize);
const School = school_models.School;
const TypeUnit = type_models.TypeUnit;


module.exports = (sequelize, Sequelize) => {

    const Product = sequelize.define('product', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false, },
        expirationDate: { type: Sequelize.DATEONLY, allowNull: false, },
        stock: { type: Sequelize.INTEGER, allowNull: false, },
        unitId: { type: Sequelize.INTEGER, allowNull: false, references: { model: TypeUnit, key: 'id' } },
        schoolId: { type: Sequelize.INTEGER, allowNull: false, references: { model: School, key: 'id' } },

    }, {
        indexes: [
            {
                unique: true,    // ensure unique combination of following fields
                fields: ['name', 'expirationDate', 'unitId', 'schoolId'], 
            }
        ]
    });

    Product.belongsTo(School, { foreignKey: 'schoolId' });
    School.hasMany(Product, { foreignKey: 'schoolId' });

    Product.belongsTo(TypeUnit, { foreignKey: 'unitId' });
    TypeUnit.hasMany(Product, { foreignKey: 'unitId' });



    const StockMovement = sequelize.define('stock_movement', {
        movementType: { type: Sequelize.ENUM('IN', 'OUT'), allowNull: false, },// "IN" pentru adăugare, "OUT" pentru scoatere
        quantity: { type: Sequelize.INTEGER, allowNull: false, },
        movementDate: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.NOW, },
        productId: { type: Sequelize.INTEGER, allowNull: false, references: { model: Product, key: 'id', }, }
    }, {
        indexes: [
            {
                unique: true,    // ensure unique combination of following fields
                fields: ['movementType', 'movementDate', 'productId'], 
            }
        ]
    });

    StockMovement.belongsTo(Product, { foreignKey: 'productId' });
    Product.hasMany(StockMovement, { foreignKey: 'productId' });


    const StockSnapshot = sequelize.define('stock_snapshot', {
        snapshotDate: { type: Sequelize.DATEONLY, allowNull: false, },
        startingQuantity: { type: Sequelize.INTEGER, allowNull: false, },
        endingQuantity: { type: Sequelize.INTEGER, allowNull: false, },
        productId: { type: Sequelize.INTEGER, allowNull: false, references: { model: Product, key: 'id', }, }
    });

    StockSnapshot.belongsTo(Product, { foreignKey: 'productId' });
    Product.hasMany(StockSnapshot, { foreignKey: 'productId' });


    return { Product, StockMovement, StockSnapshot };
};


/*

module.exports = Product;


const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // Conexiunea la baza de date
const Product = require('./Product');


module.exports = StockMovement;


const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // Conexiunea la baza de date
const Product = require('./Product');



module.exports = StockSnapshot;



///stocul curent al unui produs

Product.prototype.getCurrentStock = async function () {
    const movements = await StockMovement.findAll({
        where: { productId: this.id }
    });

    let totalIn = 0, totalOut = 0;

    movements.forEach(movement => {
        if (movement.movementType === 'IN') {
            totalIn += movement.quantity;
        } else if (movement.movementType === 'OUT') {
            totalOut += movement.quantity;
        }
    });

    return totalIn - totalOut;
};



//Generare Rapoarte Lunare
async function generateMonthlyReport(year, month) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const products = await Product.findAll();
    const report = [];

    for (const product of products) {
        const startingSnapshot = await StockSnapshot.findOne({
            where: {
                productId: product.id,
                snapshotDate: startOfMonth,
            }
        });

        const endingSnapshot = await StockSnapshot.findOne({
            where: {
                productId: product.id,
                snapshotDate: endOfMonth,
            }
        });

        report.push({
            productName: product.name,
            startingQuantity: startingSnapshot ? startingSnapshot.startingQuantity : 0,
            endingQuantity: endingSnapshot ? endingSnapshot.endingQuantity : await product.getCurrentStock(),
        });
    }

    return report;
}


*/