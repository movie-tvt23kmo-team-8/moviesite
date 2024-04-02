const pgPool = require('./pg_connection');

const sql = {
    REGISTER: 'INSERT INTO group (groupname, groupdetails, grouprole) VALUES ($1, $2, $3)'
}

async function addGroup(groupname, groupdetails, grouprole) {
    let result = await pgPool.query(sql.REGISTER, [groupname, groupdetails, grouprole]);
    return result.rows[0];
}

module.exports = {addGroup};