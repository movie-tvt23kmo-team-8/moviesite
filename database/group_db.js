const { response } = require('express');
const pgPool = require('./pg_connection');

const sql = {
    ADDGROUP: 'INSERT INTO "group" (idaccount, groupname, groupdetails, grouprole) VALUES ($1, $2, $3, $4)',
    GET_GROUPS: 'SELECT * FROM "group"'
}

async function addGroup(idaccount, groupname, groupdetails, grouprole) {
    let result = await pgPool.query(sql.ADDGROUP, [idaccount, groupname, groupdetails, grouprole]);
    return result.rows[0];
}

async function getGroups() {  
    const result = await pgPool.query(sql.GET_GROUPS);
    return result.rows;
    
}

module.exports = {addGroup, getGroups};