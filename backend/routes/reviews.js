const { addReview, getReviews } = require("../database/reviews_db");
const { getUserID } = require("../database/users_db");
const { auth } = require( "../middleware/auth");
const router = require("express").Router();


router.post('/addReview', auth, async (req, res) =>{
        console.log("Saapunut POST-pyyntö /review/addReview");
    const idaccount =await getUserID(res.locals.username);
    const star = req.body.star;
    const review = req.body.review;
    const mdbdata = req.body.mdbdata;
    console.log("idaccount: ", idaccount, " star: ", star," review: ", review," mdbdata", mdbdata);
    try {
        await addReview(idaccount, star, review, mdbdata);
        res.status(200).json({message: "Arvostelu lisätty"});
    }catch (error) {
        console.error('Error adding review: ', error);
        res.status(500).json({error: 'Error adding review'})
    }

});

router.get('/allReviews', async (req, res) => {
    console.log("allReviews pyyntö lähetetty");
    try {
        const reviews = await getReviews();
        console.log(reviews);
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

router.get('/getReviewByUserID', async (req, res) => {
    const idaccount = await getUserID(res.locals.username);
    const reviews = await getReviewByUserID(idaccount);
    res.json(reviews);
});

module.exports = router;