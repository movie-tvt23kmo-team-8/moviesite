const { group, error } = require('console');
const { addGroup, getGroups, getGroupID, getGroupIDbyGroupname, deleteGroup, getGroupMembers, getGroupDetails } = require('../database/group_db');
const { add2GroupChoices, getGroupChoices, deleteGroupChoice } = require('../database/groupchoices_db')
const { makeAdmin } = require('../database/groupmember_db');
const { getUserID } = require('../database/users_db');
const { auth } = require('../middleware/auth')

const router = require('express').Router();

// Auth middleware requires token to be able to use endpoint

router.post('/addGroup', auth, async (req, res) => {
    try {
        const groupname = req.body.groupname;
        const groupdetails = req.body.groupdetails;
        const idaccount = await getUserID(res.locals.username);
        const now = new Date();
        const grouprole = 'admin';
        const options = { timeZone: 'Europe/Helsinki' };
        const finlandTime = now.toLocaleString('en-US', options);
        const joindate = finlandTime;
        const currentGroups = await getGroups()
        console.log(currentGroups)
        const isGroupnameAlreadyTaken = currentGroups.some(group => group.groupname === groupname)
        if (isGroupnameAlreadyTaken) {
            return res.status(409).json({ error: 'Ryhmä on jo olemassa' });
        }

        await addGroup(idaccount, groupname, groupdetails);
        const idgroup = await getGroupID(idaccount)
        await makeAdmin(idaccount, idgroup, joindate, grouprole);
        res.status(200).json({ message: 'Ryhmä luotu!' });
        console.log("ryhmä luotu");
    } catch (error) {
        console.error('Error adding group:', error);
        res.status(500).json({ error: 'Error adding group' });
    }
});


router.get('/allGroups', async (req, res) => {
    const groups = await getGroups();
    res.json(groups);
});

router.post('/addToWatchlist', async (req, res) => {
    let idgroup = req.body.idgroup;
    //console.log("backendissä idgroup heti alkuun:", idgroup);
    let isNumeric = !isNaN(Number(idgroup)); // true, jos numero
    if (!isNumeric) {
        try {
            let groupname2fetch = idgroup;
            console.log("backend add2watchlist, haetaan idgroup groupnamella", groupname2fetch);
            let result = await getGroupIDbyGroupname(groupname2fetch)
            idgroup = result.idgroup;
            console.log("ja se idgroup", idgroup)
        } catch (error) {
            console.error('Error fetching groupidbygroupname:', error);
            res.status(500).json({ error: 'Error fetching groupidbygroupname' });
        }
    }
    const data = req.body.data;
    const mediatype = req.body.mediaType;
    const currentWatchlist = await getGroupChoices(idgroup);
    let isWatchlistAllready = false
    if (mediatype==="movie" || mediatype==="series"){
        console.log("testataan löytyykö ryhmästä jo elokuvaa tai sarjaa")
        isWatchlistAllready = currentWatchlist.some(wl => wl.data===data.toString() && wl.type === mediatype)
    } else{
        console.log("testataan löytyy ryhmästä jo näytöstä")
        const stringifiedData = JSON.stringify(data)
        isWatchlistAllready = currentWatchlist.some(wl => wl.data===stringifiedData && wl.type === mediatype)
    }
    console.log("current watchlist:",currentWatchlist) 
    console.log("data: ", data, "mediatype:", mediatype)
    if (isWatchlistAllready) {
        console.log("Löytyi entuudestaan jo ryhmästä")
        return res.status(400).json({ error: 'Löytyi entuudestaan jo ryhmästä' });
    }

    try {
        await add2GroupChoices(idgroup, data, mediatype)
        res.status(200).json({ message: 'Lisätty ryhmään!' });
        console.log("lisätty ryhmän tietoihin")
    } catch (error) {
        console.log("virhe ilmoitus backendistä:");
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ error: 'Error adding to watchlist' });
    }

});

router.get('/getFromWatchlist', async (req, res) => {
    const idgroup = req.body.idgroup;
    //console.log(idgroup);
    const choices = await getGroupChoices(idgroup);
    res.json(choices);

});

router.delete('/deleteFromWatchlist', async (req, res) => {
    try {
        const idgroupchoice = req.query.idgroupchoice;
        //console.log("backend poistetaan ryhmän sisältöä", idgroupchoice);
        await deleteGroupChoice(idgroupchoice);
        res.status(200).json({ message: 'You have delete from watchlist' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

router.delete('/deleteGroup', async (req, res) => {
    try {
        const idgroup = req.query.idgroup; // Varmista, että käytät query-parametreja
        await deleteGroup(idgroup); // Kutsu poisto-funktiota
        res.status(200).json({ message: `Group deleted: ${idgroup}` });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/getGroupContent', async (req, res) => {
    try {
        const idgroup = req.query.idgroup;
        //console.log("backend, haetaan ryhmän tietoja", idgroup);
        const members = await getGroupMembers(idgroup);
        const groupDetails = await getGroupDetails(idgroup);
        const groupchoices = await getGroupChoices(idgroup);
        res.json({ members: members, groupDetails: groupDetails, groupchoices: groupchoices });
    } catch (err) {
        console.error("Error to get groupContent", err);
        res.status(500).json({ error: err.message })
    }
})

module.exports = router;