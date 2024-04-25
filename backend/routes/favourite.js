const {addFavourite, getFavourites} = require('../database/favourite_db')
const { auth } = require('../middleware/auth')
const { getUserID } = require('../database/users_db');

const router = require('express').Router();

router.post('/addFavourite', auth, async (req, res) => {
    const idaccount = await getUserID(res.locals.username);
    const mdbdata = req.body.mdbdata;
    const type = req.body.type;
    try {
        await addFavourite(idaccount, mdbdata, type)
        res.status(200).json({ message: 'Suosikki lisätty!' });
    } catch (error) {
        console.error('Error adding favourite:', error);
        res.status(500).json({ error: 'Error adding favourite' });
    }
    
});

router.get('/getFavourites', auth, async (req,res) => {
    const idAccount = req.body.idaccount;
    const mdbData = await getFavourites(idAccount)
    console.log(idAccount)
    console.log('favourites: ', mdbData)
    res.status(200).json({ idaccount: idAccount, mdbdata: mdbData });
});

module.exports = router;