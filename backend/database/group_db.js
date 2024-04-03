const pgPool = require('./pg_connection');

const sql = {
    ADDGROUP: 'INSERT INTO "group" (idaccount, groupname, groupdetails, grouprole) VALUES ($1, $2, $3, $4)'
}

async function addGroup(idaccount, groupname, groupdetails, grouprole) {
    let result = await pgPool.query(sql.ADDGROUP, [idaccount, groupname, groupdetails, grouprole]);
    return result.rows[0];
}

module.exports = {addGroup};