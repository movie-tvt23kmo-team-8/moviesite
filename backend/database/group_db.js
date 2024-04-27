const { response } = require('express');
const pgPool = require('./pg_connection');
const { group } = require('console');

const sql = {
    ADDGROUP: 'INSERT INTO "group" (idaccount, groupname, groupdetails) VALUES ($1, $2, $3)',
    GET_GROUPS: 'SELECT * FROM "group"',
    GET_GROUP_ID: 'SELECT (idgroup) FROM "group" WHERE idaccount = $1 ORDER BY "idgroup" DESC LIMIT 1',
    GET_GROUP_ID_BY_NAME: 'SELECT (idgroup) FROM "group" WHERE groupname= $1',
    GET_GROUP_MEMBERS: 'SELECT groupmember.*, account.username AS username FROM groupmember JOIN  account ON groupmember.idaccount = account.idaccount WHERE idgroup=$1',
    GET_GROUP_DETAILS: 'SELECT * FROM "group" WHERE idgroup=$1'
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

async function getGroupIDbyGroupname(groupname) {
    let result = await pgPool.query(sql.GET_GROUP_ID_BY_NAME, [groupname])
    return result.rows[0];
}

async function getGroupMembers(idgroup) {
    const result = await pgPool.query(sql.GET_GROUP_MEMBERS, [idgroup])
    console.log(result.rows);
    return result.rows;
}

async function getGroupDetails(idgroup) {
    const result = await pgPool.query(sql.GET_GROUP_DETAILS, [idgroup])
    console.log(result.rows);
    return result.rows;
}


module.exports = {addGroup, getGroups, getGroupID, getGroupIDbyGroupname, getGroupMembers, getGroupDetails};
