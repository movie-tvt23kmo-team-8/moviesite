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
    return result.rows[0].idaccount;
}

module.exports = {getUsers, getUserID};