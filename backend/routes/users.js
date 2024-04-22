const { error } = require('console');
const { getUsers, getUserID, deleteUser, getImageIdByUsername, updateImageIdByUsername } = require('../database/users_db');
const { auth } = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const router = require('express').Router();

router.get('/all', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

router.get('/getUserID', async (req, res) => {
    try {
        const username = req.query.username;
        const idaccount = await getUserID(username);
        res.status(200).json({idaccount: idaccount});
    } catch(err) {
        res.status(505).json({error: err.message});
    }
});

router.get('/personal', auth, async (req, res) => {
    try {
        const username = res.locals.username;
        const imageid = await getImageIdByUsername(username); // Assuming you have a function to fetch imageid
        const idaccount = await getUserID(username);
        console.log('Username:', username); // Log username
        console.log('Image ID:', imageid); // Log imageid
        res.status(200).json({ username: username, imageid: imageid, idaccount: idaccount });
    } catch (err) {
        console.error('Error:', err.message); // Log error
        res.status(500).json({ error: err.message });
    }
});

// users.js (backend route)

router.put('/updatePic', auth, async (req, res) => { // Ensure authentication
    try {
        const { idaccount } = req.body; // Get idaccount from request body
        const { imageId } = req.body; // Get imageId from request body
        console.log('Updating profile picture for:', idaccount); // Log idaccount
        console.log('Request Body:', req.body); // Log request body
        const rowsAffected = await updateImageIdByUsername(idaccount, imageId);
        console.log('Rows affected:', rowsAffected); // Log rowsAffected
        if (rowsAffected === 1) {
            res.status(200).json({ message: 'Profile picture updated successfully' });
        } else {
            throw new Error('Failed to update profile picture');
        }
    } catch (err) {
        console.error('Error updating profile picture:', err);
        res.status(500).json({ error: err.message });
    }
});


router.delete('/delete', auth, async (req, res) =>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        const idaccount = await getUserID(username);
        await deleteUser(idaccount);
        res.status(200).json({ message: 'You have deleted your account' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;