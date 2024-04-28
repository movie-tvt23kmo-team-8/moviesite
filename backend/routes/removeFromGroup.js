const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getUserID, removeUserFromGroup } = require('../database/users_db');

// DELETE route to remove user from a group
router.delete('/', auth, async (req, res) => {
    try {
        const groupId = req.body.groupId; // Assuming groupId is sent in the request body
        const username = res.locals.username;
        const idaccount = await getUserID(username);
        const rowsAffected = await removeUserFromGroup(idaccount, groupId);
        
        if (rowsAffected === 1) {
            res.status(200).json({ message: 'User removed from group successfully' });
        } else {
            throw new Error('Failed to remove user from group');
        }
    } catch (err) {
        console.error('Error removing user from group:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;