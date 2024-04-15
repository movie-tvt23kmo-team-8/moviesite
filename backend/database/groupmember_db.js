const pgPool = require('./pg_connection');

const sql = {
    SEND_REQUEST: 'INSERT INTO "groupmember" (idaccount, idgroup, joindate) VALUES ($1, $2, $3, $4)',
    MAKE_ADMIN: 'INSERT INTO "groupmember" (idaccount, idgroup, joindate, grouprole) VALUES ($1, $2, $3, $4)'
}

async function sendRequest(idaccount, idgroup, joindate) {
    let result = await pgPool.query(sql.SEND_REQUEST, [idaccount, idgroup, joindate])
    return result.rows;
}

async function makeAdmin(idaccount, idgroup, joindate, grouprole) {
    let result = await pgPool.query(sql.MAKE_ADMIN, [idaccount, idgroup, joindate, grouprole])
    return result.rows;
}

module.exports = {sendRequest, makeAdmin}