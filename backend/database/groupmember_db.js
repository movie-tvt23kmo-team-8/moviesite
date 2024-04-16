const pgPool = require('./pg_connection');

const sql = {
    MAKE_USER: 'INSERT INTO "groupmember" (idaccount, idgroup, joindate, grouprole) VALUES ($1, $2, $3, $4)',
    MAKE_ADMIN: 'INSERT INTO "groupmember" (idaccount, idgroup, joindate, grouprole) VALUES ($1, $2, $3, $4)'
}

async function makeUser(idaccount, idgroup, joindate, grouprole) {
    let result = await pgPool.query(sql.MAKE_USER, [idaccount, idgroup, joindate, grouprole])
    return result.rows;
}

async function makeAdmin(idaccount, idgroup, joindate, grouprole) {
    let result = await pgPool.query(sql.MAKE_ADMIN, [idaccount, idgroup, joindate, grouprole])
    return result.rows;
}

module.exports = {makeUser, makeAdmin}