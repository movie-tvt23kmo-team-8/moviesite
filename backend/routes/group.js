<<<<<<< HEAD:routes/group.js
const { addGroup } = require('../database/group_db');
const { getUserID } = require('../database/users_db');
const { auth } = require('../middleware/auth');
=======

const { addGroup, getGroups } = require('../database/group_db');
>>>>>>> 9391f4c93dd2ffdfa7792eb59c6eb49d69d4c070:backend/routes/group.js

const router = require('express').Router();

// Auth middleware requires token to be able to use endpoint

router.post('/addGroup', auth ,async (req, res) => {
    const groupname = req.body.groupname;
    const groupdetails = req.body.groupdetails;
    const grouprole = 'admin';
    const idaccount = await getUserID(res.locals.username);

    try {
    await addGroup(idaccount, groupname, groupdetails, grouprole);
    
    res.status(200).json({ message: 'Ryhmä luotu!' });
    
    }catch(error) {
        console.error('Error adding group:', error);
    }
});


router.get('/allGroups', async (req, res) => {
    const groups = await getGroups();
    res.json(groups);
});

module.exports = router;