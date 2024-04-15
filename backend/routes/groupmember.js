const {sendRequest, makeAdmin} = require('../database/groupmember_db');
const { getUserID } = require('../database/users_db');
const { auth } = require('../middleware/auth')

const router = require('express').Router();

router.post('/sendRequest', auth, async (req, res) => {
    const idaccount = await getUserID(res.locals.username);
    const idgroup = req.body.idgroup;
    const now = new Date();
    const grouprole = 'user'
    const options = {timeZone: 'Europe/Helsinki'};
    const finlandTime = now.toLocaleString('en-US', options)
    const joindate = finlandTime

    try {
    await sendRequest(idaccount, idgroup, joindate, grouprole);
    
    res.status(200).json({ message: 'Request sent!' });
    
    }catch(error) {
        console.error('Error sending request:', error);
    }
});

module.exports = router;
