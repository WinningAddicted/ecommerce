var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var db = require('../../database_config');

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(token)
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'wingify', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;   
        console.log(decoded)
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

router.post('/auth', function(req, res) {
return res.status(403).send({ 
        success: false, 
        message: 'Wohoo' 
    });
});

router.add = function(req, callback) {
	var password = req.body.password || req.body.password
	var firstName = req.body.firstName || req.body.firstName
	var lastName = req.body.lastName || req.body.lastName
	var username = req.body.username || req.body.username
	console.log(password)
	bcrypt.hash(password, saltRounds, function(err, hash) {
		if(err){
			var response = {error : true}
			response.message = "Failed to encrypt password"
			response.response_code = -1
			response.err = err
			callback(response)
			return
		}
		else{
			password = hash
			db.query('INSERT INTO users(firstName, lastName, username,password,role) VALUES(?,?,?,?,?)', [firstName, lastName, username, password, 1] , function(err, rows) {
					if(err) {
						var response = {error : true}
						response.error = true;
						response.message = "Failed to add user";
						response.response_code = -1
					} else {
						var response = {error : false}
						response.message = "Added user successfully";
						response.response_code = 1
					}
					callback(response)
					return
			});
		}
	});
	

}

router.post('/add', function (req, res) {
	router.add(req, function(response) {
		res.send(response)
	});
});

module.exports = router

