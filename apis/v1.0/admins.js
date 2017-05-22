//Libraries
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

//Files
var utils = require('./utils');
var db = require('../../databaseConnection');

// configs
var securityConfigs = require('../../configs').securityConfigs
const saltRounds = securityConfigs.saltRounds;
const secretKey = securityConfigs.secretKey;

//Middleware
router.use(function(req, res, next) {
    /**
     * Used to authenticate admins route.
     * @param {string} token - Used to verify authenticity of auth-token.
     */

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        //Verify Token
        jwt.verify(token, secretKey, function(err, decoded) {
            if (err) {
                var message = "Failed to authenticate token";
                utils.sendResponse(true, message, -1, err, function(response) {
                    return res.send(response);;
                });
            }
            else {
                //Token Verified. Pass On the Request
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        var message = "No token Provided";
        utils.sendResponse(true, message, 0, null, function(response) {
            return res.send(response);
        });
    }
});

//Functions
router.add = function(req, callback) {
    /**
     * Used to add an admin.
     * @param {string} password - The password of the new admin.
     * @param {string} username - The username of the new admin.
     * @param {string} firstName - The first name of the new admin.
     * @param {string} lastName - The lastname of the new admin.
     */

    var password = req.body.password || req.query.password;
    var firstName = req.body.firstName || req.query.firstName;
    var lastName = req.body.lastName || req.query.lastName;
    var username = req.body.username || req.query.username;

    if (password && firstName && username) {
        //Hash The Password
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) {
                var message = "Failed to encrypt password";
                utils.sendResponse(true, message, -1, err, function(response) {
                    callback(response);
                    return;
                });
            }
            else {
                password = hash;
                db.query('INSERT INTO users (firstName, lastName, username, password, role) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, username, password, 1], function(err, rows) {
                    if (err) {
                        var message = "Failed to add user";
                        utils.sendResponse(true, message, -1, err, function(response) {
                            callback(response);
                            return;
                        });
                    }
                    else {
                        var message = "Added user successfully";
                        utils.sendResponse(false, message, 1, null, function(response) {
                            callback(response);
                            return;
                        });
                    }
                });
            }
        });
    }
    else {
        var message = "password, firstName and username are required fields";
        utils.sendResponse(true, message, -2, null, function(response) {
            callback(response);
            return;
        });
    }

}

router.post('/add', function(req, res) {
    router.add(req, function(response) {
        res.send(response)
    });
});

module.exports = router
