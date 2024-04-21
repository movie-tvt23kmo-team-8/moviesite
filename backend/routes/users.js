const { error } = require('console');
const { getUsers, getUserID, deleteUser, getImageIdByUsername } = require('../database/users_db');
const { auth } = require('../middleware/auth')

const router = require('express').Router();

router.get('/all', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

router.get('/getUserID', async (req, res) => {
    try {
        const username = req.query.username;
        const idaccount = await getUserID(username);
        res.status(200).json({idaccount: idaccount});
    } catch(err) {
        res.status(505).json({error: err.message});
    }
});

router.get('/personal', auth, async (req, res) => {
    try {
        const username = res.locals.username;
        const imageid = await getImageIdByUsername(username); // Assuming you have a function to fetch imageid
        console.log('Username:', username); // Log username
        console.log('Image ID:', imageid); // Log imageid
        res.status(200).json({ username: username, imageid: imageid });
    } catch (err) {
        console.error('Error:', err.message); // Log error
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete', auth, async (req, res) =>{
    try {
        const idaccount = req.query.idaccount
        await deleteUser(idaccount)
        res.status(200).json({message: 'You have deleted your acccount'})
    } catch(err){
        res.status(500).json({error: err.message})
    }
});

module.exports = router;