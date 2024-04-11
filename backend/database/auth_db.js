const pgPool = require('./pg_connection');

const sql = {
    REGISTER: 'INSERT INTO "account" (username, password) VALUES ($1, $2)',
    GETPASSWORD: 'SELECT "password" FROM "account" WHERE "username" = $1'
}

async function register(username, passwordHash) {
    let result = await pgPool.query(sql.REGISTER, [username, passwordHash]);
    return result.rows[0];
}

async function getPassword(username){
    const result = await pgPool.query(sql.GETPASSWORD, [username]);
    return result.rowCount > 0 ? result.rows[0].password : null;
}

module.exports = {register, getPassword};