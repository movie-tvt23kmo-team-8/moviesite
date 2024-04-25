const pgPool = require('./pg_connection');

const sql = {
    ADD_FAVOURITE: 'INSERT INTO "favourite" (idaccount, mdbdata) VALUES ($1, $2)',
    GET_FAVOURITES: 'SELECT * FROM "favourite" WHERE idaccount = $1'
}

async function addFavourite(idaccount, mdbdata) {
    // Convert mdbdata to a string representation
    const truncatedMdbdata = JSON.stringify(mdbdata).substring(0, 255);  
    let result = await pgPool.query(sql.ADD_FAVOURITE, [idaccount, truncatedMdbdata]);
    return result.rows;
}

async function getFavourites(idaccount) {
    try {
        const result = await pgPool.query(sql.GET_FAVOURITES, [idaccount]);
        console.log('idaccount: ',idaccount)
        return result.rows;
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
}

module.exports = {addFavourite, getFavourites}