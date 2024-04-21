const pgPool = require('./pg_connection');

const sql = {
    ADD: 'INSERT INTO "groupchoices" (idgroup, data, type) VALUES ($1, $2, $3)',
    GET: 'SELECT data, type FROM "groupchoices" WHERE idgroup= $1',
    DELETE: 'DELETE from "groupchoices" WHERE idgroupchoises = $1'
}

async function add2GroupChoices(idgroup, data, mediaType) {
    console.log("tietokannassa", idgroup, data, mediaType);
    let result = await pgPool.query(sql.ADD, [idgroup, data, mediaType])
    return result.rows[0];
}

async function getGroupChoices(idgroup) {
    let result = await pgPool.query(sql.GET, [idgroup])
    return result.rows;
}

async function deleteGroupChoice(idgroupchoice) {
    console.log("tietokannassa", idgroupchoice);
    let result = await pgPool.query(sql.DELETE, [idgroupchoice])
    console.log(result);
    return result.rows;
}

module.exports = {add2GroupChoices, getGroupChoices, deleteGroupChoice}

