const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/contact', function(req, res) {
    res.render('pages/contact');
});

app.listen(8080);
console.log('Server is listening on port 8080');
