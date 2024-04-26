const pgPool = require('./pg_connection');

const sql = {
    REGISTER: 'INSERT INTO "account" (username, password, joindate, sharekey) VALUES ($1, $2, $3, $4)',
    GETPASSWORD: 'SELECT "password" FROM "account" WHERE "username" = $1',
    GETUSERBYUSERNAME: 'SELECT * FROM "account" WHERE "username" = $1',
    UPDATEPASSWORD: 'UPDATE "account" SET "password" = $1 WHERE "username" = $2'
};

async function register(username, passwordHash, joindate, sharekey) {
    console.log("tietokannassa sharekey: ", sharekey);
    let result = await pgPool.query(sql.REGISTER, [username, passwordHash, joindate, sharekey]);
    return result.rows[0];
}

async function getPassword(username) {
    const result = await pgPool.query(sql.GETPASSWORD, [username]);
    return result.rowCount > 0 ? result.rows[0].password : null;
}

async function getUserByUsername(username) {
    const result = await pgPool.query(sql.GETUSERBYUSERNAME, [username]);
    return result.rowCount > 0 ? result.rows[0] : null;
}

async function updatePassword(username, newPasswordHash) {
    await pgPool.query(sql.UPDATEPASSWORD, [newPasswordHash, username]);
}


module.exports = { register, getPassword, getUserByUsername, updatePassword };
