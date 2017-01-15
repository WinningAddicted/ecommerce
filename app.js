//Libraries
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Files
var users = require('./apis/v1.0/users')
var admins = require('./apis/v1.0/admins')
var products = require('./apis/v1.0/products')
var appConfigs = require('./configs').appConfigs

//Set a secret key for the jwt token
app.set('secret', 'secret');

//MiddleWares
app.use(bodyParser.urlencoded({
    limit: appConfigs.bodyParserLimit,
    extended: true
}));

// Allow CROS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Routes
app.use('/users', users);
app.use('/admins', admins);
app.use('/products', products);

//App
var server = app.listen(appConfigs.port, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Server is Up At Port :%s", port)

});