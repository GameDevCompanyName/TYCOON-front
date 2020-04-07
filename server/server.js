const express = require("express");

const app = express();

let root = '../public/';

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: root});
});

app.get('/login', function (req, res) {
    res.sendFile('login.html', {root: root});
});

app.get('/registration', function (req, res) {
    res.sendFile('registration.html', {root: root});
});

app.use(express.static('../public'));

app.listen(80);
