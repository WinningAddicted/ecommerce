var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var db = require('../../database_config');
var protectedRoutes = express.Router();

router.post('/auth', function(req, res) {
return res.status(403).send({ 
        success: false, 
        message: 'Wohoo' 
    });
});

router.login = function(req, callback) {

	db.query('SELECT username,password FROM users WHERE username = ?', [req.body.username] , function(err, rows) {
				if(err) {
					var response = {error : true}
					response.err = err;
					response.message = "Failed to find user";
					response.response_code = -1
					callback(response)
					return
				} 
				else {
					if(rows.length == 0){
						var response = {error : false}
						response.message = "Username doesn't exist";
						response.response_code = 0
						callback(response)
						return		
					}
					else{
						bcrypt.compare(req.body.password, rows[0].password, function(err, res) {
							if(res){
								var user = {id : rows[0].id}
								var token = jwt.sign(user, 'wingify', {
						          expiresIn: '30m' // expires in 24 hours
						        });
						        var response = {error : false}
								response.message = "Returning Token";
								response.response_code = 1
								response.token = token
								callback(response)
								return	
							}
							else{
								var response = {error : false}
								response.message = "Password Doesn't Match";
								response.response_code = 2
								callback(response)
								return
							}
						});
					}
				}

		});
}

router.post('/login', function (req, res) {
	router.login(req, function(response) {
		res.send(response)
	});
});

module.exports = router

