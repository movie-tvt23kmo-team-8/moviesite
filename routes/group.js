const { addGroup } = require('../database/group_db');
const { getUserID } = require('../database/users_db');
const { auth } = require('../middleware/auth');

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

module.exports = router;