//Libraries
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

//Files
var db = require('../../databaseConnection');
var utils = require('./utils');

// configs
var securityConfigs = require('../../configs').securityConfigs
const saltRounds = securityConfigs.saltRounds;
const secretKey = securityConfigs.secretKey;
const tokenTimeout = securityConfigs.tokenTimeout

//Functions
router.login = function(req, callback) {
    /**
     * Used to add an login and get auth-token.
     * @param {string} password - The password of admin.
     * @param {string} username - The username of admin.
     */

    var response = {};
    var username = req.body.username || req.query.username;
    var password = req.body.password || req.query.password;

    //If All Params Present
    if (username && password) {
        db.query('SELECT username,password FROM users WHERE username = ?', [username], function(err, rows) {
            if (err) {
                var message = "Failed to find user";
                utils.sendResponse(true, message, -1, err, function(response) {
                    callback(response);
                    return;
                });
            }
            else {
                if (!rows.length) {
                    var message = "Username doesn't exist";
                    utils.sendResponse(false, message, 0, null, function(response) {
                        callback(response);
                        return;
                    });
                }
                else {
                    //Compare password hash
                    bcrypt.compare(password, rows[0].password, function(err, res) {
                        if (res) {
                            var user = {
                                id: rows[0].id
                            };

                            var token = jwt.sign(user, secretKey, {
                                expiresIn: tokenTimeout
                            });

                            var message = "Returning Token";
                            utils.sendResponse(false, message, 1, token, function(response) {
                                callback(response);
                                return;
                            });
                        }
                        else {
                            var message = "Password Doesn't Match";
                            utils.sendResponse(false, message, 2, null, function(response) {
                                callback(response);
                                return;
                            });
                        }
                    });
                }
            }
        });
    }
    else {
        var message = "username and password are required fields";
        utils.sendResponse(true, message, -2, null, function(response) {
            callback(response);
            return;
        });
    }
}

router.post('/login', function(req, res) {
    router.login(req, function(response) {
        res.send(response)
    });
});

module.exports = router
