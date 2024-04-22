const { error } = require('console');
const { getUsers, getUserID, deleteUser } = require('../database/users_db');
const { auth } = require('../middleware/auth')
const jwt = require('jsonwebtoken')

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

router.get('/personal', auth, async (req,res)=>{
    try{
       const username = res.locals.username;
       const idaccount = await getUserID(username);
       res.status(200).json({username: username, idaccount: idaccount});
    }catch(err){
       res.status(500).json({error: err.message});
    }
});

router.delete('/delete', auth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        const idaccount = await getUserID(username);
        await deleteUser(idaccount);
        res.status(200).json({ message: 'You have deleted your account' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;