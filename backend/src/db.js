import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('braingrowdb', 'root', "Basket*627", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

export default sequelize;
