const pgPool = require('./pg_connection');

const sql = {
    ADD_FAVOURITE: 'INSERT INTO "favourite" (idaccount, mdbdata) VALUES ($1, $2)',
    GET_FAVOURITES: 'SELECT * FROM "favourite"'
}

async function addFavourite(idaccount, mdbdata) {
    // Convert mdbdata to a string representation
    const truncatedMdbdata = JSON.stringify(mdbdata).substring(0, 255);  
    let result = await pgPool.query(sql.ADD_FAVOURITE, [idaccount, truncatedMdbdata]);
    return result.rows;
}

async function getFavourites() {
    const result = await pgPool.query(sql.GET_FAVOURITES);
    return result.rows;
}

module.exports = {addFavourite, getFavourites}