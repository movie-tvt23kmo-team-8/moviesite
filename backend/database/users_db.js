const pgPool = require('./pg_connection');

const sql = {
    GET_ALL_USERS: 'SELECT "username" FROM "account"',
    GET_USER: 'SELECT "idaccount" FROM "account" WHERE "username" = $1',
}

async function getUsers(){
    let result = await pgPool.query(sql.GET_ALL_USERS);
    return result.rows;
}

async function getUserID(username) {
    let result = await pgPool.query(sql.GET_USER, [username]);
    const userId = result.rows[0].idaccount;
    return parseInt(userId);
}

module.exports = {getUsers, getUserID};