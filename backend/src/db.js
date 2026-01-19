import Sequelize from 'sequelize'
const sequelize = new Sequelize("BrainGrowDB", "root", "Test123!", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false
});

export default sequelize;