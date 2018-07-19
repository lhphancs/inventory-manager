const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const api = require('./routes/api');


const app = express(express);
const port = process.env.PORT || 3000;

const mongoPath = 'mongodb://localhost:27017/ebay'
const mongoose = require('mongoose');
mongoose.connect(mongoPath);
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

db.once('connected', () => {
    console.log(`Connected to database: ${mongoPath}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

