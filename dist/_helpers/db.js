"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
const account_model_1 = __importDefault(require("../accounts/account.model"));
const refresh_token_model_1 = __importDefault(require("../accounts/refresh-token.model"));
const db = {};
exports.default = db;
initialize();
async function initialize() {
    const host = process.env.DB_HOST;
    const port = Number(process.env.DB_PORT);
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const connection = await promise_1.default.createConnection({
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
    const sequelize = new sequelize_1.Sequelize(database, user, password, {
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
    db.Account = (0, account_model_1.default)(sequelize);
    db.RefreshToken = (0, refresh_token_model_1.default)(sequelize);
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
