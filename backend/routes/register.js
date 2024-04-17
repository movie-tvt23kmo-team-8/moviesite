const { error } = require('console');
const {register} = require('../database/auth_db');
const isUsernameTaken = require('./isUsernameTaken'); 


const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const now = new Date();
    const options = {timeZone: 'Europe/Helsinki'};
    const finlandTime = now.toLocaleString('en-US', options)
    const joindate = finlandTime

    try {
      if (isUsernameLengthOver4(username) || isPasswordLengthOver4(password)) {
        return res.status(400).json({ error: 'Käyttäjänimen ja salasanan on oltava 4 kirjainta tai enemmän!'})
      }

      if (await isUsernameTaken(username)) {
        return res.status(400).json({ error: 'Käyttäjänimi on varattu!' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await register(username,hashedPassword,joindate);
  
    res.status(200).json({ message: 'Käyttäjä luotu!' });
    
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
});

const isUsernameLengthOver4 = (username) => {
  return username.length < 4;
};

const isPasswordLengthOver4 = (password) => {
  return password.length < 4;
};

module.exports = router;