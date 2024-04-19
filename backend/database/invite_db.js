const pgPool = require('./pg_connection');

const sql = {
   SEND_REQUEST: 'INSERT INTO "invites" (idaccountReceiver, idaccountSender, idgroup, hasaccepted) VALUES ($1, $2, $3, $4)',
   ACCEPT_REQUEST: 'UPDATE "invites" SET hasaccepted = true WHERE idinvites = $1',
   CHECK_IF_ACCEPTED: 'SELECT "hasaccepted" FROM "invites" WHERE idinvites = $1',
   GET_IDINVITES: 'SELECT "idinvites" FROM "invites" WHERE idaccountReceiver = $1 AND idaccountSender = $2 AND idgroup = $3',
   GET_IDINVITES_FORUSER: 'SELECT "idinvites" FROM "invites" WHERE idaccountsender = $1 AND idgroup = $2',
   GET_ALL_INVITES: 'SELECT * FROM "invites" WHERE idaccountreceiver = $1',
   DENY_REQUEST: 'DELETE FROM "invites" WHERE "idaccountreceiver" = $1 AND "idaccountsender" = $2 AND "idgroup" = $3'
}

async function sendRequest(idaccountReceiver, idaccountSender, idgroup, hasAccpeted) {
    let result = await pgPool.query(sql.SEND_REQUEST, [idaccountReceiver, idaccountSender, idgroup, hasAccpeted])
    return result.rows;
}

async function acceptRequest(idinvites) {
    let result = await pgPool.query(sql.ACCEPT_REQUEST, [idinvites])
    return result.rows;
}

async function denyRequest(idaccountreceiver, idaccountsender, idgroup) {
    let result = await pgPool.query(sql.DENY_REQUEST, [idaccountreceiver, idaccountsender, idgroup])
    return result.rows;
}

async function checkIfAccepted(idinvites) {
    let result = await pgPool.query(sql.CHECK_IF_ACCEPTED, [idinvites]);
    if (result.rows.length > 0) {
        const hasAccepted = result.rows[0].hasaccepted;
        return hasAccepted; 
    } else {
        return false; 
    }
}

async function getIdinvites(idaccountreceiver, idaccountsender, idgroup) {
    let result = await pgPool.query(sql.GET_IDINVITES, [idaccountreceiver, idaccountsender, idgroup])
    return result.rows[0].idinvites;
}

async function getIdinvitesForUser(idaccountsender, idgroup) {
    let result = await pgPool.query(sql.GET_IDINVITES_FORUSER, [idaccountsender, idgroup])
    const idinvites = result.rows[0].idinvites;
    return idinvites;
}


async function getAllInvites(idaccountReceiver) {
    let result = await pgPool.query(sql.GET_ALL_INVITES, [idaccountReceiver])
    return result.rows;
}


module.exports = {sendRequest, acceptRequest, checkIfAccepted, getIdinvites, getAllInvites, getIdinvitesForUser, denyRequest}