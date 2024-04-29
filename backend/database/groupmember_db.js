const pgPool = require('./pg_connection');

const sql = {
    MAKE_USER: 'INSERT INTO "groupmember" (idaccount, idgroup, joindate, grouprole) VALUES ($1, $2, $3, $4)',
    MAKE_ADMIN: 'INSERT INTO "groupmember" (idaccount, idgroup, joindate, grouprole) VALUES ($1, $2, $3, $4)',
    GET_USER_GROUPS: `SELECT "group".idgroup, "group".idaccount, "group".groupname, "group".groupdetails, "groupmember"."grouprole" 
                        FROM  "group" JOIN  groupmember ON "group".idgroup = groupmember.idgroup WHERE  groupmember.idaccount = $1`
}

async function makeUser(idaccount, idgroup, joindate, grouprole) {
    let result = await pgPool.query(sql.MAKE_USER, [idaccount, idgroup, joindate, grouprole])
    return result.rows;
}

async function makeAdmin(idaccount, idgroup, joindate, grouprole) {
    let result = await pgPool.query(sql.MAKE_ADMIN, [idaccount, idgroup, joindate, grouprole])
    return result.rows;
}

async function getUserGroups(idaccount) {
    try {
        const result = await pgPool.query(sql.GET_USER_GROUPS, [idaccount]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw error;
    }
}

module.exports = { makeUser, makeAdmin, getUserGroups };