const router = require('express').Router();
const bcrypt = require('bcrypt');
const { getUserByUsername, updatePassword } = require('../database/auth_db');

router.post('/change-password', async (req, res) => {
    const username = req.body.username;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    try {
        const user = await getUserByUsername(username);

        // Tarkistetaan vastaako vanha salasana tietokannassa olevaa
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Vanha salasana väärin' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Päivittää salasanan
        await updatePassword(username, hashedNewPassword);

        res.status(200).json({ message: 'Salasanan päivitys onnistui' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Salasanan päivitys epäonnistui' });
    }
});

module.exports = router;
