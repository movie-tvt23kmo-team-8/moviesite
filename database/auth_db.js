const pgPool = require('./pg_connection');

const sql = {
    REGISTER: 'INSERT INTO account (username, password) VALUES ($1, $2)'
}

async function register(username, passwordHash) {
    let result = await pgPool.query(sql.REGISTER, [username, passwordHash]);
    return result.rows[0];
}

module.exports = {register};