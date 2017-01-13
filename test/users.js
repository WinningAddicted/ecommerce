var expect  = require("chai").expect;
var request = require("request");


describe("Checking Login API", function() {
    it("returns token", function(done) {
      this.timeout(0);
      var url = "http://localhost:3000/users/login?username=admin&password=admin";
      request.post(url, function(error, response, body) {
        expect(JSON.parse(response.body).response_code).to.equal(1);
	expect(JSON.parse(response.body).token.length).to.equal(128);
        done();
      });
    });

   it("returns username doesn't exist", function(done) {
      this.timeout(0);
      var url = "http://localhost:3000/users/login?username=foo&password=admin";
      request.post(url, function(error, response, body) {
        expect(JSON.parse(response.body).response_code).to.equal(0);
        expect(Object.keys(JSON.parse(response.body)).indexOf('token')).to.equal(-1);
        done();
      });
    });

    it("returns Password Doesn't Match", function(done) {
      this.timeout(0);
      var url = "http://localhost:3000/users/login?username=admin&password=bar";
      request.post(url, function(error, response, body) {
        expect(JSON.parse(response.body).response_code).to.equal(2);
        expect(Object.keys(JSON.parse(response.body)).indexOf('token')).to.equal(-1);
        done();
      });
    });

});
