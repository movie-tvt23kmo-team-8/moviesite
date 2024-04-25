const {makeUser} = require('../database/groupmember_db');
const { checkIfAccepted, getIdinvitesForUser } = require('../database/invite_db');
const { getUserID } = require('../database/users_db');
const { auth } = require('../middleware/auth')

const router = require('express').Router();

router.post('/makeUser', auth, async (req, res) => {
    const idaccount = req.body.idaccountSender;
    const idgroup = req.body.idgroup;
    const now = new Date();
    const grouprole = 'user'
    const options = {timeZone: 'Europe/Helsinki'};
    const finlandTime = now.toLocaleString('en-US', options)
    const joindate = finlandTime

    try {
        const idinvites = await getIdinvitesForUser(idaccount, idgroup);
        const isAccepted = await checkIfAccepted(idinvites)
    if(isAccepted === true){
        await makeUser(idaccount, idgroup, joindate, grouprole);
    
        res.status(200).json({ message: 'Tervetuloa ryhmään!' });
    } else {
        res.status(500).json({error: 'You are not accepted'});
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'User not authorized'});
    }
});

module.exports = router;
