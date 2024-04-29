const { response } = require('express');
const pgPool = require('./pg_connection');
const { group } = require('console');

const sql = {
    ADDGROUP: 'INSERT INTO "group" (idaccount, groupname, groupdetails) VALUES ($1, $2, $3)',
    GET_GROUPS: 'SELECT * FROM "group"',
    GET_GROUP_ID: 'SELECT (idgroup) FROM "group" WHERE idaccount = $1 ORDER BY "idgroup" DESC LIMIT 1',
    GET_GROUP_ID_BY_NAME: 'SELECT (idgroup) FROM "group" WHERE groupname= $1',
    GET_GROUP_MEMBERS: `SELECT groupmember.*, account.imageid, account.username AS username 
                            FROM groupmember JOIN  account ON groupmember.idaccount = account.idaccount WHERE idgroup=$1`,
    GET_GROUP_DETAILS: 'SELECT * FROM "group" WHERE idgroup=$1',
    GET_GROUP_ID_BY_NAME: 'SELECT (idgroup) FROM "group" WHERE groupname= $1', 
    DELETE_GROUP: ` BEGIN;
        DELETE FROM "groupchoices" WHERE idgroup = $1;
        DELETE FROM "groupmember" WHERE idgroup = $1;
        DELETE FROM "group" WHERE idgroup = $1;
        COMMIT;`
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


const deleteGroup = async (idgroup) => {
    await pgPool.query('BEGIN'); 
    try {
        await pgPool.query('DELETE FROM "invites" WHERE idgroup = $1', [idgroup]);
        await pgPool.query('DELETE FROM "groupchoices" WHERE idgroup = $1', [idgroup]);
        await pgPool.query('DELETE FROM "groupmember" WHERE idgroup = $1', [idgroup]);
        await pgPool.query('DELETE FROM "group" WHERE idgroup = $1', [idgroup]);
        await pgPool.query('COMMIT');
    } catch (error) {
        await pgPool.query('ROLLBACK'); // Peruutetaan, jos tapahtuu virhe
        throw error;
    }
};

module.exports = {addGroup, getGroups, getGroupID, getGroupIDbyGroupname, getGroupMembers, getGroupDetails, deleteGroup};