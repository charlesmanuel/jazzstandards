//imports
var express = require('express');
var multer = require('multer');
var app = express();
var path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');
var upload = multer();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Discogs = require('disconnect').Client;
var dis = new Discogs({
	consumerKey: 'xHWuJTGKGdQVNZAYKjVt', 
	consumerSecret: 'JyadjtXNwyiUjlGFUeMDBoKashrdqWaB'
});

//connect discogs database
var db = dis.database();

//connect database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/jazz_db');

//port
const PORT = process.env.PORT || 3000;

// parsing
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));

//views
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', function(req, res){
    res.render('index');
});

app.post('/', function(req, res){
    var standard = encodeURI(req.body.inputStandard);
    res.redirect('/results/' + standard);
});

app.get('/results/:standardname', function(req, res){
    var intrack = decodeURI(req.params.standardname);
    db.search({genre: "jazz", track: intrack}, function(err, data){
        var titles = [];
        for (i=0; i<20; i++){
            titles.push(data.results[i].title);
        }
        res.render('results', {inlist: titles, name: intrack});
    });
});

//listen
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
