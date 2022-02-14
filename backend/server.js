require('dotenv').config();
require('./config/passport')
const express = require('express');
const server = express();
const  cors = require('cors');
const path = require('path');
const passport = require('passport') 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ExpressError = require('./utils/ExpressError');
const UserRoute = require('./routes/UserRoute');

let port = process.env.PORT || 8201;
let mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017/c2stem-run';

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MONGO CONNECTION OPEN!")
}).catch(err => {
    console.log("MONGO CONNECTION ERROR!!")
    console.log(err)
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});
server.set('view engine', 'html');
server.use(express.static(path.join(__dirname, '../dist')))
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: false
}));
server.use(cors());
server.use(passport.initialize());

server.use('/user', UserRoute)
server.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '../dist/index.html'))
})

server.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

server.use((err, req, res, ) => {
    const { status = 500} =  err;
    if(!err.message) err.message = 'There is an error';
    res.status(status)
    res.json({
        message: err.message,
        error: err
      });
})

server.listen(port, () => {
    console.log('Serving on port',port);
})