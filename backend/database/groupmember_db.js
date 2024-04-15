const pgPool = require('./pg_connection');

const sql = {
    SEND_REQUEST: 'INSERT INTO "groupmember" (idaccount, idgroup, joindate) VALUES ($1, $2, $3)'
}

async function sendRequest(idaccount, idgroup, joindate) {
    let result = await pgPool.query(sql.SEND_REQUEST, [idaccount, idgroup, joindate])
    return result.rows;
}

module.exports = {sendRequest}