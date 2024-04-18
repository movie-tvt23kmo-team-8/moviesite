const pgPool = require('./pg_connection');

const sql = {
    GET_ALL_REVIEWS: 'SELECT review.idreview, review.idaccount, review.star, review.review, review.mdbdata, account.username FROM review LEFT JOIN account ON review.idaccount = account.idaccount ORDER BY review.idreview DESC;',
    GET_USER_REVIEWS: 'SELECT * FROM "review" WHERE "idaccount" = $1',
    ADD_REVIEW: 'INSERT INTO "review" (idaccount, star, review, mdbdata) VALUES ($1, $2, $3, $4)',
}

async function getReviews(){
    let result = await pgPool.query(sql.GET_ALL_REVIEWS);
    return result.rows;
}

async function getReviewByUserID(idaccount) {
    let result = await pgPool.query(sql.GET_USER, [idaccount]);
    return result.rows;
}

async function addReview(idaccount, star, review, mdbdata){
    let result = await pgPool.query(sql.ADD_REVIEW, [idaccount, star, review, mdbdata]);
    return result.rows[0];
}

module.exports = {getReviews, getReviewByUserID, addReview};