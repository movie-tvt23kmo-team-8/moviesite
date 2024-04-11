require('dotenv').config();
const users = require('./routes/users');
const register = require('./routes/register');
const group = require('./routes/group');
const login  = require('./routes/login');
const cors = require('cors');
const express = require('express');
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
app.use('/', register);
app.use('/group', group);
app.use('/', login);

app.get('/', (req, res) => {
    res.send('Welcome to moviesite website')
});
