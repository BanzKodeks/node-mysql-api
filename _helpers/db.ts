import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    const host = process.env.DB_HOST as string;
    const port = Number(process.env.DB_PORT);
    const user = process.env.DB_USER as string;
    const password = process.env.DB_PASSWORD as string;
    const database = process.env.DB_NAME as string;

    const connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const sequelize = new Sequelize(database, user, password, {
        dialect: 'mysql',
        host,
        port,
        dialectOptions: {
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            }
        }
    });

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, {
        foreignKey: 'accountId',
        as: 'refreshTokens',
        onDelete: 'CASCADE'
    });

    db.RefreshToken.belongsTo(db.Account, {
        foreignKey: 'accountId',
        as: 'account'
    });

    await sequelize.sync();
}