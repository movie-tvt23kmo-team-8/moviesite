const {addFavourite, getFavourites} = require('../database/favourite_db')
const { auth } = require('../middleware/auth')
const { getUserID } = require('../database/users_db');

const router = require('express').Router();

router.post('/addFavourite', auth, async (req, res) => {
    const idaccount = await getUserID(res.locals.username);
    const mdbdata = req.body.mdbdata

    try {
        await addFavourite(idaccount, mdbdata)
        res.status(200).json({ message: 'Suosikki lisätty!' });
    } catch (error) {
        console.error('Error adding favourite:', error);
        res.status(500).json({ error: 'Error adding favourite' });
    }
    
});

router.get('/getFavourites', async (req,res) => {
    const favourites = await getFavourites();
    console.log(favourites)
    res.json(favourites)
});

module.exports = router;