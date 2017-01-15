var expect = require("chai").expect;
var request = require("request");
var testConfigs = require("../configs").testConfigs;

var host = "http://" + testConfigs.host + ":" + testConfigs.port

describe("Checking Users API", function() {
    
    describe("Checking Login", function() {
    
        it("Returns Token", function(done) {
            this.timeout(0);
            var url = host + "/users/login?username=admin&password=admin";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(1);
                expect(JSON.parse(response.body).data.length).to.equal(128);
                done();
            });
        });
    
        it("Returns Username is required", function(done) {
            this.timeout(0);
            var url = host + "/users/login?password=admin";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(-2);
                expect(Object.keys(JSON.parse(response.body)).indexOf('data')).to.equal(-1);
                done();
            });
        });
    
        it("Returns Password is required", function(done) {
            this.timeout(0);
            var url = host + "/users/login?username=admin";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(-2);
                expect(Object.keys(JSON.parse(response.body)).indexOf('data')).to.equal(-1);
                done();
            });
        });

        it("Returns Username Doesn't Exist", function(done) {
            this.timeout(0);
            var url = host + "/users/login?username=foo&password=admin";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(0);
                expect(Object.keys(JSON.parse(response.body)).indexOf('data')).to.equal(-1);
                done();
            });
        });

        it("Returns Password Doesn't Match", function(done) {
            this.timeout(0);
            var url = host + "/users/login?username=admin&password=bar";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(2);
                expect(Object.keys(JSON.parse(response.body)).indexOf('data')).to.equal(-1);
                done();
            });
        });
    });
});