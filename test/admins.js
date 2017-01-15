var expect = require("chai").expect;
var request = require("request");
var testConfigs = require("../configs").testConfigs;

var host = "http://" + testConfigs.host + ":" + testConfigs.port

describe("Checking Admins API", function() {
    
    describe("Checking Add API", function() {

        it("Returns Success", function(done) {
            this.timeout(0);
            var url = host + "/users/login?username=admin&password=admin";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(1);
                expect(JSON.parse(response.body).data.length).to.equal(128);
                var token = JSON.parse(response.body).data
                url = host + "/admins/add?username=test&password=test&firstName=Test&lastName=User&token=" + token;
                request.post(url, function(error, response, body) {
                    expect(JSON.parse(response.body).response_code).to.equal(1);
                    done();
                });
            });
        });
    
        it("Returns Username is Required", function(done) {
            this.timeout(0);
            var url = host + "/users/login?username=admin&password=admin";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(1);
                expect(JSON.parse(response.body).data.length).to.equal(128);
                var token = JSON.parse(response.body).data
                url = host + "/admins/add?password=test&firstName=Test&lastName=User&token=" + token;
                request.post(url, function(error, response, body) {
                    expect(JSON.parse(response.body).response_code).to.equal(-2);
                    done();
                });
            });
        });
   
        it("Returns Password is Required", function(done) {
            this.timeout(0);
            var url = host + "/users/login?username=admin&password=admin";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(1);
                expect(JSON.parse(response.body).data.length).to.equal(128);
                var token = JSON.parse(response.body).data
                url = host + "/admins/add?username=test&firstName=Test&lastName=User&token=" + token;
                request.post(url, function(error, response, body) {
                    expect(JSON.parse(response.body).response_code).to.equal(-2);
                    done();
                });
            });
        });
   
        it("Returns First Name is Required", function(done) {
            this.timeout(0);
            var url = host + "/users/login?username=admin&password=admin";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(1);
                expect(JSON.parse(response.body).data.length).to.equal(128);
                var token = JSON.parse(response.body).data
                url = host + "/admins/add?username=test&password=test&lastName=User&token=" + token;
                request.post(url, function(error, response, body) {
                    expect(JSON.parse(response.body).response_code).to.equal(-2);
                    done();
                });
            });
        });
   
        it("Returns Invalid Token", function(done) {
            this.timeout(0);
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ 9.eyJpYXQiOjE0ODQwNTQ1NTcsImV4cCI6MTQ4NDA1NjM1N30.8 w67D-4YDBI8ATwZTDSlaIAxkViXU4u7_kS_BWitt22DQ"
            url = host + "/admins/add?username=test&password=test&firstName=Test&lastName=User&token=" + token;
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(-1);
                done();
            });
        });
   
        it("Returns No Token", function(done) {
            this.timeout(0);
            url = host + "/admins/add?username=test&password=test&firstName=Test&lastName=User";
            request.post(url, function(error, response, body) {
                expect(JSON.parse(response.body).response_code).to.equal(0);
                done();
            });
        });

    });
});