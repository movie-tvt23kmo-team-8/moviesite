const pgPool = require('./pg_connection');

const sql = {
    GET_ALL_USERS: 'SELECT "username" FROM "account"',
    GET_USER: 'SELECT "idaccount" FROM "account" WHERE "username" = $1',
    DELETE_USER: 'DELETE FROM "account" WHERE "idaccount" = $1',
    GET_PIC: 'SELECT imageid FROM "account" WHERE "username" = $1',
    UPDATE_PIC: 'UPDATE "account" SET imageid = $1 WHERE "idaccount" = $2',
    GET_USER_GROUPS: 'SELECT "group"."groupname" FROM "group" JOIN "groupmember" ON "group"."idgroup"="groupmember"."idgroup" WHERE "group"."idaccount" = $1 ',
    UPDATE_PASSWORD: 'UPDATE "account" SET "password" = $1 WHERE "idaccount" = $2'


async function getUsers(){
    let result = await pgPool.query(sql.GET_ALL_USERS);
    return result.rows;
}

async function getUserID(username) {
    try {
        const result = await pgPool.query(sql.GET_USER, [username]);
        if (result.rows.length > 0) {
            return result.rows[0].idaccount;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error in getUserID:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

async function getImageIdByUsername(username) {
    try {
        const { rows } = await pgPool.query(sql.GET_PIC, [username]); // Corrected reference
        if (rows.length > 0) {
            return rows[0].imageid;
        } else {
            throw new Error('Imageid not found for username');
        }
    } catch (error) {
        console.error('Error in getImageIdByUsername:', error);
        throw error;
    }
}

async function updateImageIdByUsername(idaccount, newImageId) {
    try {
        const result = await pgPool.query(sql.UPDATE_PIC, [newImageId, idaccount]);
        if (result.rowCount === 1) {
            return result.rowCount; // Return the number of rows affected (should be 1 if successful)
        } else {
            throw new Error('Failed to update profile picture. No rows affected.');
        }
    } catch (error) {
        console.error('Error in updateImageIdByUsername:', error);
        throw error;
    }
}

async function updatePasswordById(idaccount, newPasswordHash) {
    try {
        const result = await pgPool.query(sql.UPDATE_PASSWORD, [newPasswordHash, idaccount]);
        if (result.rowCount === 1) {
            return result.rowCount;
        } else {
            throw new Error('Failed to update password. No rows affected.');
        }
    } catch (error) {
        console.error('Error in updatePasswordById:', error);
        throw error;
    }
}



async function deleteUser(idaccount) {
    let result = await pgPool.query(sql.DELETE_USER, [idaccount]);
    return result.rows;
}

async function getUserGroups(idaccount) {
    let result = await pgPool.query(sql.GET_USER_GROUPS, [idaccount]);
    return result.rows
}

module.exports = { getUsers, getUserID, deleteUser, getImageIdByUsername, updateImageIdByUsername, getUserGroups, updatePasswordById };

