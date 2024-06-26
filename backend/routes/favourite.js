const { addFavourite, getFavourites } = require('../database/favourite_db')
const { auth } = require('../middleware/auth')
const { getUserID, getUserIDByPasskey, getSharekey } = require('../database/users_db');

const router = require('express').Router();

router.post('/addFavourite', auth, async (req, res) => {
    try {
        const idaccount = await getUserID(res.locals.username);
        const mdbdata = req.body.mdbdata;
        const type = req.body.type;
        const currentFavourites = await getFavourites(idaccount, 0); //haetaan nykyiset suosikit
        const isFavouriteAlreadyAdded = currentFavourites.some(fav => fav.mdbdata === mdbdata.toString() && fav.type === type); //tarkistetaan onko jo suosikeissa
        
        if (isFavouriteAlreadyAdded) {
            return res.status(400).json({ error: 'Suosikki on jo olemassa' });
        }

        await addFavourite(idaccount, mdbdata, type)
        res.status(200).json({ message: 'Suosikki lisätty!' });
    } catch (error) {
        console.error('Error adding favourite:', error);
        res.status(500).json({ error: 'Error adding favourite' });
    }

});

router.get('/getFavourites', auth, async (req, res) => {
    const idAccount = await getUserID(res.locals.username);
    const items = isNaN(parseInt(req.query.items)) ? 0 : parseInt(req.query.items);
    //console.log("items: ", items)
    const favourites = await getFavourites(idAccount, items);
    const sharekey = await getSharekey(idAccount);
    console.log('favourites: ', favourites)
    res.status(200).json({ idaccount: idAccount, favourites: favourites, sharekey: sharekey });
});

module.exports = router;