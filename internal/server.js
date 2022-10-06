'use strict';

// express is a nodejs web server
// https://www.npmjs.com/package/express
const express = require('express');

// converts content in the request into parameter req.body
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');

// bring in repository
const db = require('./repository');

// create the server
const app = express();

// the backend server will parse json, not a form request
app.use(bodyParser.json());

// allow AJAX calls from 3rd party domains
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, MERGE, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// health endpoint - returns an empty array
app.get('/', (req, res) => {
    res.json([]);
});

// version endpoint to provide easy convient method to demonstrating tests pass/fail
app.get('/version', (req, res) => {
    res.json({ version: '1.0.0' });
});

// this has been modifed to call the shared getEvents method that
// returns data from firestore
app.get('/events', (req, res) => {
   db.getEvents().then((data) => {
       res.json(data);
    });
});

// This has been modified to insert into firestore, and then call 
// the shared getEvents method.
app.post('/event', (req, res) => {
    db.addEvent(req)
        .then((data) => {
            console.log(data);
            res.json(data);
        });
});

// put because this is an update. Passes through to shared method.
app.put('/event/like', (req, res) => {
    db.addLike(req.body.id)
        .then((data) => {
            res.json(data);
        });
});

// Passes through to shared method.
// Delete distinguishes this route from put above
app.delete('/event/like', (req, res) => {
    db.removeLike(req.body.id)
        .then((data) => res.json(data));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const SERVICE_PORT = process.env.SERVICE_PORT ? process.env.SERVICE_PORT : 8082;
const server = app.listen(SERVICE_PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Events app listening at http://${host}:${port}`);
});

module.exports = app;