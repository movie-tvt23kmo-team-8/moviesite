const { auth } = require('../middleware/auth')
const { getUserID } = require('../database/users_db');
const { sendRequest, acceptRequest, getIdinvites, getAllInvites, getIdinvitesForUser } = require('../database/invite_db');
const { response } = require('express');

const router = require('express').Router();

router.post('/sendRequest', auth, async (req, res) => {
    const idaccountReceiver = req.body.idaccountReceiver;
    const idaccountSender = await getUserID(res.locals.username);
    const idgroup = req.body.idgroup;
    const hasAccpeted = false;

    try {
        await sendRequest(idaccountReceiver, idaccountSender, idgroup, hasAccpeted)
        res.status(200).json({ message: 'Pyyntö lähetetty, odota ryhmän johtajan hyväksyntää!' });
    } catch(error) {
        console.error('Error sending request:', error);
    }
});

router.post('/acceptRequest', auth, async (req, res) => {
    const idaccountReceiver = await getUserID(res.locals.username)
    const idaccountSender = req.body.idaccountSender
    const idgroup = req.body.idgroup
    
    try {
        const idinvites = await getIdinvites(idaccountReceiver, idaccountSender, idgroup);
        await acceptRequest(idinvites)
        res.status(200).json({ message: 'Pyyntö hyväksytty' });
    } catch(error) {
        console.error('Error sending request:', error);
    }
});

router.get('/getAllInvites', auth, async (req, res) => {
    const idaccountreceiver = req.body.idaccountreceiver
    try {
        const invites = await getAllInvites(idaccountreceiver)
        res.status(200).json({ message: 'All the invites: ', invites });
    } catch(error) {
    console.error('Error sending request:', error);
    }
});

router.get('/getIdinvitesForUser', auth, async (req, res) => {
    const idaccountSender = req.body.idaccount
    const idgroup = req.body.idgroup
    
    try {
        const idinvites = await getIdinvitesForUser(idaccountSender, idgroup)
        res.status(200).json({ message: 'idinvites: ', idinvites });
    } catch(error) {
        console.error('Error sending request:', error);
    }
});

module.exports = router;