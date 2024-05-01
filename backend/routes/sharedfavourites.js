const router = require('express').Router();
const { getFavourites } = require('../database/favourite_db');
const { getUserIDByPasskey, getUsername } = require('../database/users_db');


router.get('/', async (req, res) => {
    try{const sharekey = req.query.sharekey;
    //console.log("backendissä, sharekey:",sharekey);
    const idAccount = await getUserIDByPasskey(sharekey);
    const favourites = await getFavourites(idAccount);
    const username = await getUsername(idAccount);
    //console.log("suosikit haettu, yhteensä ",favourites.length);
    res.status(200).json({ favourites: favourites, username: username });
    }catch (err) {
        console.error(err);
    }
})

module.exports = router