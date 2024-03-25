const {register} = require('../database/auth_db');

const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    await register(username,hashedPassword);

    res.end();
});

module.exports = router;