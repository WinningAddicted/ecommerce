var expect  = require("chai").expect;
var request = require("request");


describe("Checking Products API", function() {
	
	describe("Checking Add API", function() {
		
		it("Returns Success", function(done) {
			this.timeout(0);
			var url = "http://localhost:3000/users/login?username=admin&password=admin";
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(1);
				expect(JSON.parse(response.body).token.length).to.equal(128);
				var token = JSON.parse(response.body).token
				url = "http://localhost:3000/products/add?name=N72&brand=Nokia&category=Electronics&price=8000&token=" + token;
				request.post(url, function(error, response, body) {
					expect(JSON.parse(response.body).response_code).to.equal(1);
					done();
				});
			});
		});

		it("Returns Brand Doesn't Exist", function(done) {
			this.timeout(0);
			var url = "http://localhost:3000/users/login?username=admin&password=admin";
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(1);
				expect(JSON.parse(response.body).token.length).to.equal(128);
				var token = JSON.parse(response.body).token
				url = "http://localhost:3000/products/add?name=N72&brand=foo&category=Electronics&price=8000&token=" + token;
				request.post(url, function(error, response, body) {
					expect(JSON.parse(response.body).response_code).to.equal(2);
					done();
				});
			});
		});

		it("Returns Category Doesn't Exist", function(done) {
			this.timeout(0);
			var url = "http://localhost:3000/users/login?username=admin&password=admin";
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(1);
				expect(JSON.parse(response.body).token.length).to.equal(128);
				var token = JSON.parse(response.body).token
				url = "http://localhost:3000/products/add?name=N72&brand=Nokia&category=foo&price=8000&token=" + token;
				request.post(url, function(error, response, body) {
					expect(JSON.parse(response.body).response_code).to.equal(3);
					done();
				});
			});
		});

		it("Returns Invalid Token", function(done) {
			this.timeout(0);
			var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ 9.eyJpYXQiOjE0ODQwNTQ1NTcsImV4cCI6MTQ4NDA1NjM1N30.8 w67D-4YDBI8ATwZTDSlaIAxkViXU4u7_kS_BWitt22DQ"
			url = "http://localhost:3000/products/add?username=test&password=test&firstName=Test&lastName=User&token=" + token;
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(-1);
				done();
			});
		});
	});

	describe("Checking Delete API", function() {
		
		it("Returns Success", function(done) {
			this.timeout(0);
			var url = "http://localhost:3000/users/login?username=admin&password=admin";
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(1);
				expect(JSON.parse(response.body).token.length).to.equal(128);
				var token = JSON.parse(response.body).token
				url = "http://localhost:3000/products/delete?id=3&token=" + token;
				request.post(url, function(error, response, body) {
					expect(JSON.parse(response.body).response_code).to.equal(1);
					done();
				});
			});
		});

		it("Returns Invalid Token", function(done) {
			this.timeout(0);
			var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ 9.eyJpYXQiOjE0ODQwNTQ1NTcsImV4cCI6MTQ4NDA1NjM1N30.8 w67D-4YDBI8ATwZTDSlaIAxkViXU4u7_kS_BWitt22DQ"
			url = "http://localhost:3000/products/add?username=test&password=test&firstName=Test&lastName=User&token=" + token;
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(-1);
				done();
			});
		});
	});

	describe("Checking Edit API", function() {
		
		it("Nothing To Update", function(done) {
			this.timeout(0);
			var url = "http://localhost:3000/users/login?username=admin&password=admin";
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(1);
				expect(JSON.parse(response.body).token.length).to.equal(128);
				var token = JSON.parse(response.body).token
				url = 'http://localhost:3000/products/edit?id=2&fields={}&token=' + token;
				request.post(url, function(error, response, body) {
					expect(JSON.parse(response.body).response_code).to.equal(2);
					done();
				});
			});
		});

		it("Returns Success", function(done) {
			this.timeout(0);
			var url = "http://localhost:3000/users/login?username=admin&password=admin";
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(1);
				expect(JSON.parse(response.body).token.length).to.equal(128);
				var token = JSON.parse(response.body).token
				url = 'http://localhost:3000/products/edit?id=2&fields={"name":"N74","brand":"Puma","category":"electronics","price":"4000"}&token=' + token;
				request.post(url, function(error, response, body) {
					expect(JSON.parse(response.body).response_code).to.equal(1);
					done();
				});
			});
		});

		it("Returns Brand Doesn't Exist", function(done) {
			this.timeout(0);
			var url = "http://localhost:3000/users/login?username=admin&password=admin";
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(1);
				expect(JSON.parse(response.body).token.length).to.equal(128);
				var token = JSON.parse(response.body).token
				url = 'http://localhost:3000/products/edit?id=2&fields={"name":"N74","brand":"foo","category":"electronics","price":"4000"}&token=' + token;
				request.post(url, function(error, response, body) {
					expect(JSON.parse(response.body).response_code).to.equal(0);
					done();
				});
			});
		});


		it("Returns Category Doesn't Exist", function(done) {
			this.timeout(0);
			var url = "http://localhost:3000/users/login?username=admin&password=admin";
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(1);
				expect(JSON.parse(response.body).token.length).to.equal(128);
				var token = JSON.parse(response.body).token
				url = 'http://localhost:3000/products/edit?id=2&fields={"name":"N74","brand":"Puma","category":"foo","price":"4000"}&token=' + token;
				request.post(url, function(error, response, body) {
					expect(JSON.parse(response.body).response_code).to.equal(0);
					done();
				});
			});
		});

		it("Returns Invalid Token", function(done) {
			this.timeout(0);
			var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ 9.eyJpYXQiOjE0ODQwNTQ1NTcsImV4cCI6MTQ4NDA1NjM1N30.8 w67D-4YDBI8ATwZTDSlaIAxkViXU4u7_kS_BWitt22DQ"
			url = "http://localhost:3000/products/add?username=test&password=test&firstName=Test&lastName=User&token=" + token;
			request.post(url, function(error, response, body) {
				expect(JSON.parse(response.body).response_code).to.equal(-1);
				done();
			});
		});
	});

});