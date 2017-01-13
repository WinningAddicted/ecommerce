var expect  = require("chai").expect;
var request = require("request");


describe("Checking Admins API", function() {
    it("returns token", function(done) {
      this.timeout(0);
      var url = "http://localhost:3000/users/login?username=admin&password=admin";
      request.post(url, function(error, response, body) {
        expect(JSON.parse(response.body).response_code).to.equal(1);
	expect(JSON.parse(response.body).token.length).to.equal(128);
	var token = JSON.parse(response.body).token
	url = "http://localhost:3000/admins/add?username=test&password=test&firstName=Test&lastName=User&token=" + token;
	request.post(url, function(error, response, body) {
		console.log(response.body);
        	expect(JSON.parse(response.body).response_code).to.equal(1);
        	done();
      	});
      });
    });

});
