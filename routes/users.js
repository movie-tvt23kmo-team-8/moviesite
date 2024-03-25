const { getUsers, getUserID } = require('../database/users_db');

const router = require('express').Router();

router.get('/all', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

router.get('/', async (req, res) => {
    const userID = await getUserID(req.query.username);
    console.log(userID);
    res.json(userID);
});

module.exports = router;