const { addGroup } = require('../database/group_db');

const router = require('express').Router();

router.post('/addGroup', async (req, res) => {
    const groupname = req.body.groupname;
    const groupdetails = req.body.groupdetails;
    const idaccount = req.body.idaccount;
    const grouprole = req.body.grouprole;
    
    try {
    await addGroup(idaccount, groupname, groupdetails, grouprole);
    
    res.status(200).json({ message: 'Ryhmä luotu!' });
    
    }catch(error) {
        console.error('Error adding group:', error);
    }
});

module.exports = router;