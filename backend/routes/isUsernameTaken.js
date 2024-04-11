const pgPool = require('../database/pg_connection');

async function isUsernameTaken(username) {
    let client;
    try {
    client = await pgPool.connect();
    const query = 'SELECT * FROM account WHERE username = $1';
    const result = await client.query(query, [username]);
    return result.rows.length > 0; 
  } catch (error) {
    console.error('Error checking username:', error);
    return true; 
  } finally {
    client.release();
  }
}

module.exports = isUsernameTaken;