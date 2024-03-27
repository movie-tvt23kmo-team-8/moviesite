const {register} = require('../database/auth_db');
const isUsernameTaken = require('./isUsernameTaken'); 


const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
      if (await isUsernameTaken(username)) {
        return res.status(400).json({ error: 'Käyttäjänimi on varattu!' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await register(username,hashedPassword);
  
    res.status(200).json({ message: 'Käyttäjä luotu!' });
    
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

module.exports = router;