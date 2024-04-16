const { getUsers, getUserID } = require('../database/users_db');
const { auth } = require('../middleware/auth')

const router = require('express').Router();

router.get('/all', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

router.get('/', async (req, res) => {
    try {
        const username = req.body.username;
        const idaccount = await getUserID(username);
        res.status(200).json(idaccount);
    } catch(err) {
        res.status(505).json({error: err.message});
    }
});

router.get('/personal', auth, async (req,res)=>{
    try{
       const username = res.locals.username;
       res.status(200).json({username: username});
    }catch(err){
       res.status(500).json({error: err.message});
    }
});

module.exports = router;