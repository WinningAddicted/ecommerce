//Libraries
var express = require('express');
var router = express.Router();

//Functions
router.sendResponse = function(error, message, response_code, data, callback) {
    /**
     * Wrapper to send Response.
     * @param {bool} error - error status.
     * @param {string} message - The response message.
     * @param {int} response_code - The code of response.
     * @param {string,object} data - The data to send.
     */

    var response = {};
    response.error = error;
    response.message = message;
    response.response_code = response_code
    if (data) {
        response.data = data;
    }
    callback(response);
    return;
}

module.exports = router;