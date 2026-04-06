import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize('braingrowdb', 'root', 'ani1234!', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

export default sequelize;
