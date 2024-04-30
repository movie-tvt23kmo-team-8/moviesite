const pgPool = require('./pg_connection');

const sql = {
    GET_ALL_USERS: 'SELECT "username" FROM "account"',
    GET_USER: 'SELECT "idaccount" FROM "account" WHERE "username" = $1',
    DELETE_USER: 'DELETE FROM "account" WHERE "idaccount" = $1',
    GET_PIC: 'SELECT imageid FROM "account" WHERE "username" = $1',
    UPDATE_PIC: 'UPDATE "account" SET imageid = $1 WHERE "idaccount" = $2',
    GET_USER_GROUPS:'SELECT DISTINCT "group"."groupname" FROM "groupmember" JOIN "group" ON "groupmember"."idgroup" = "group"."idgroup" WHERE "groupmember"."idaccount" = $1', 
    UPDATE_PASSWORD: 'UPDATE "account" SET "password" = $1 WHERE "idaccount" = $2',
    GET_USER_BY_PASSKEY: 'SELECT "idaccount" FROM "account" WHERE "sharekey" = $1',
    GET_SHAREKEY: 'SELECT "sharekey" FROM "account" WHERE "idaccount" = $1',
    GET_USERNAME: 'SELECT "username" FROM "account" WHERE "idaccount" = $1',
    GET_JOINDATE: 'SELECT "joindate" FROM "account" WHERE "idaccount" = $1',
    REMOVE_USER_FROM_GROUP: 'DELETE FROM "groupmember" WHERE "idgroup" = $1 AND "idaccount" = $2'
}

async function getUsers() {
    let result = await pgPool.query(sql.GET_ALL_USERS);
    //console.log('GET_ALL_USERS: ', result)
    return result.rows;
}

async function getSharekey(idAccount) {
    let result = await pgPool.query(sql.GET_SHAREKEY, [idAccount]);
    //console.log("Sharekey tietokannassa: ", result.rows[0].sharekey);

    return result.rows[0].sharekey;
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

async function getUserIDByPasskey(sharedkey) {
    //console.log("tietokannassa sharedkey: ", sharedkey)
    try {
        const result = await pgPool.query(sql.GET_USER_BY_PASSKEY, [sharedkey])
        if (result.rows.length > 0) {
            //console.log(result.rows[0].idaccount)
            return result.rows[0].idaccount;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error in getUserID:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

async function getUsername(idaccount) {
    let result = await pgPool.query(sql.GET_USERNAME, [idaccount])
    return result.rows[0].username
}


async function removeUserFromGroup(idgroup, idAccount) {
    try {
        const result = await pgPool.query(sql.REMOVE_USER_FROM_GROUP, [idgroup, idAccount]);
        if (result.rowCount === 1) {
            return result.rowCount;
        } else {
            throw new Error('Failed to remove user from group. No rows affected.');
        }
    } catch (error) {
        console.error('Error in removeUserFromGroup:', error);
        throw error;
    }
}

async function getJoinDate(idaccount) {
    let result = await pgPool.query(sql.GET_JOINDATE, [idaccount]);
    return result.rows[0].joindate
}


async function removeUserFromGroup(idgroup, idAccount) {
    try {
        const result = await pgPool.query(sql.REMOVE_USER_FROM_GROUP, [idgroup, idAccount]);
        if (result.rowCount === 1) {
            return result.rowCount;
        } else {
            throw new Error('Failed to remove user from group. No rows affected.');
        }
    } catch (error) {
        console.error('Error in removeUserFromGroup:', error);
        throw error;
    }
}

module.exports = { getUsers, getUserID, deleteUser, getImageIdByUsername, updateImageIdByUsername, getUserGroups, updatePasswordById, getUserIDByPasskey, getSharekey, getUsername, getJoinDate, removeUserFromGroup };

