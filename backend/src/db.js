import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize('braingrowdb', 'root', process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

export default sequelize;
