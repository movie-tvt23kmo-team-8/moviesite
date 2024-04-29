const pgPool = require('./pg_connection');

const sql = {
    ADD_FAVOURITE: 'INSERT INTO "favourite" (idaccount, mdbdata, type) VALUES ($1, $2, $3)',
    GET_FAVOURITES: 'SELECT DISTINCT idaccount, mdbdata, type FROM "favourite" WHERE "idaccount" = $1 ORDER BY idaccount',
    GET_5FAVOURITES: 'SELECT DISTINCT mdbdata, type FROM "favourite" WHERE "idaccount" = $1 ORDER BY "mdbdata" DESC LIMIT $2;'
}

async function addFavourite(idaccount, mdbdata, type) {
    // Convert mdbdata to a string representation
    const truncatedMdbdata = JSON.stringify(mdbdata).substring(0, 255);
    let result = await pgPool.query(sql.ADD_FAVOURITE, [idaccount, truncatedMdbdata, type]);
    return result.rows;
}

async function getFavourites(idAccount, items) {
    if (items == 0) {
        try {
            const result = await pgPool.query(sql.GET_FAVOURITES, [idAccount]);
            //console.log('idaccount: ', idAccount);
            return result.rows;
        } catch (error) {
            console.error('Error getting favorites:', error);
            return [];
        }
    } else {
        try {
            const result = await pgPool.query(sql.GET_5FAVOURITES, [idAccount, items]);
            //console.log('idaccount: ', idAccount);
            return result.rows;
        } catch (error) {
            console.error('Error getting favorites:', error);
            return [];
        }
    }
}


module.exports = { addFavourite, getFavourites }