require('dotenv').config();
const { getPassword } = require('../database/auth_db');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
        const storedPassword = await getPassword(username);

        if(storedPassword){
            const passwordMatch = await bcrypt.compare(password, storedPassword);
            if(passwordMatch){
                const token = jwt.sign({username: username }, process.env.JWT_SECRET);
                res.status(200).json({jwtToken: token},);
            } else {
                res.status(401).json({error: 'User not authorized'});            
            }
            } else {
                res.status(404).json({error: 'User not found'});
            }
            } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

module.exports = router;