var express = require('express');
var app = express();
var mysql = require("mysql");
var bodyParser  = require('body-parser');
var jwt = require('jsonwebtoken');

var users = require('./apis/v1.0/users')
var admins = require('./apis/v1.0/admins')
var products = require('./apis/v1.0/products')
var database_config = require('./database_config')

//Set a secret key for the jwt token
app.set('secret', 'secret');

//MiddleWares

// Allow CROS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
app.get('/', function(req, res) {
	var user = 'Lol'
	var token = jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: '1m' });


    res.send('Hello! The API is at http://localhost:3000 And token : ' + token );
});

app.use('/users', users);
app.use('/admins', admins);
app.use('/products', products);

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server is Up At Port :%s", port)

});