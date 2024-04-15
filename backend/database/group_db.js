const { response } = require('express');
const pgPool = require('./pg_connection');
const { group } = require('console');

const sql = {
    ADDGROUP: 'INSERT INTO "group" (idaccount, groupname, groupdetails) VALUES ($1, $2, $3)',
    GET_GROUPS: 'SELECT * FROM "group"',
    GET_GROUP_ID: 'SELECT (idgroup) FROM "group" WHERE idaccount = $1 ORDER BY "idgroup" DESC LIMIT 1'
}

async function addGroup(idaccount, groupname, groupdetails) {
    let result = await pgPool.query(sql.ADDGROUP, [idaccount, groupname, groupdetails]);
    return result.rows[0];
}


async function getGroups() {  
    const result = await pgPool.query(sql.GET_GROUPS);
    return result.rows;
    
}

async function getGroupID(idaccount) {
    let result = await pgPool.query(sql.GET_GROUP_ID, [idaccount]);
    return result.rows[0].idgroup;
}


module.exports = {addGroup, getGroups, getGroupID};
