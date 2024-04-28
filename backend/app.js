require('dotenv').config();
const users = require('./routes/users');
const register = require('./routes/register');
const group = require('./routes/group');
const tmdb = require('./routes/tmdb');
const login = require('./routes/login');
const favourite = require('./routes/favourite')
const groupmember = require('./routes/groupmember');
const invite = require('./routes/invite');
const search = require('./routes/search');
const review = require('./routes/reviews');
const passwordRouter = require('./routes/password');
const removeFromGroup = require('./routes/removeFromGroup');

const cors = require('cors');
const express = require('express');
const { log } = require('console');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3001;
app.listen(PORT,() => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/users', users);
app.use('/group', group);
app.use('/tmdb', tmdb);
app.use('/', login);
app.use('/', register);
app.use('/groupmember', groupmember);
app.use('/invite', invite);
app.use('/search', search);
app.use('/review', review);
app.use('/favourite', favourite)
app.use('/password', passwordRouter);
app.use('/removeFromGroup', removeFromGroup);

app.get('/', (req, res) => {
    res.send('Welcome to moviesite website')
});

module.exports = app;