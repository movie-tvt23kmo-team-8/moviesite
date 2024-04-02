require('dotenv').config();
const users = require('./routes/users');
const auth = require('./routes/auth');
const group = require('./routes/group');
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
app.use('/auth', auth);
app.use('/group', group);

app.get('/', (req, res) => {
    res.send('Welcome to moviesite website')
});
