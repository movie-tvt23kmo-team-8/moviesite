const { group } = require('console');
const { addGroup, getGroups, getGroupID } = require('../database/group_db');
const { makeAdmin } = require('../database/groupmember_db');
const { getUserID } = require('../database/users_db');
const { auth } = require('../middleware/auth')

const router = require('express').Router();

// Auth middleware requires token to be able to use endpoint

router.post('/addGroup', auth, async (req, res) => {
    const groupname = req.body.groupname;
    const groupdetails = req.body.groupdetails;
    const idaccount = await getUserID(res.locals.username);
    const now = new Date();
    const grouprole = 'admin';
    const options = { timeZone: 'Europe/Helsinki' };
    const finlandTime = now.toLocaleString('en-US', options);
    const joindate = finlandTime;

    try {
        await addGroup(idaccount, groupname, groupdetails);
        const idgroup = await getGroupID(idaccount)
        await makeAdmin(idaccount, idgroup, joindate, grouprole);
        res.status(200).json({ message: 'Ryhmä luotu!' });
    } catch (error) {
        console.error('Error adding group:', error);
        res.status(500).json({ error: 'Error adding group' });
    }
});


router.get('/allGroups', async (req, res) => {
    const groups = await getGroups();
    res.json(groups);
});

module.exports = router;