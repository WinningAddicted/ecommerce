var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var db = require('../../database_config');

var table_mappings = {"category":"categories","brand":"brands"}

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'wingify', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.', response_code: -1 });    
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

	var brand = req.body.brand || req.query.brand
	var category = req.body.category  || req.query.category
	var name = req.body.name || req.query.name
	var price = req.body.price || req.query.price
	db.query('SELECT id FROM brands WHERE brand = ?', [brand] , function(err, rows) {
			if(err) {
				var response = {error : true}
				response.error = true;
				response.message = "Failed to get brands";
				response.response_code = -1
				response.err = err
				debugger
				callback(response)
				return
			} else {
				if(rows.length == 0){
					var response = {error : false}
					response.error = true;
					response.message = "Brand Doesn't Exist. Please Register Brand";
					response.response_code = 2
					callback(response)
					return
				}
				else{
					var brand = rows[0].id
					db.query('SELECT id FROM categories WHERE category = ?', [category] , function(err, rows) {
							if(err) {
								var response = {error : true}
								response.error = true;
								response.message = "Failed to get category";
								response.response_code = -1
								callback(response)
								return
							} else {
								if(rows.length == 0){
									var response = {error : false}
									response.error = true;
									response.message = "Category Doesn't Exist. Please Register Category";
									response.response_code = 3
									callback(response)
									return
								}
								else{
									var category = rows[0].id
									db.query('INSERT INTO products(name, brand, category,price) VALUES(?,?,?,?)',[name,brand,category,price],function(err,rows){
										if(err){
											var response = {error : true}
											response.error = true;
											response.message = "Failed to get brands";
											response.response_code = -1
											callback(response)
											return
										}
										else{
											var response = {error : false}
											response.message = "Added product successfully";
											response.response_code = 1
											callback(response)
											return
										}
									})
								}
							}

					});
				}
			}

	});
}

router.delete = function(req, callback) {

	var id = req.body.id || req.query.id

	db.query('DELETE FROM products WHERE id = ?', [req.body.id] , function(err, rows) {
			if(err) {
				var response = {error : true}
				response.error = true;
				response.message = "Failed to get brands";
				response.response_code = -1
				debugger
				callback(response)
				return
			} 
			else {
				var response = {error : false}
				response.message = "Deleted product successfully";
				response.response_code = 1
				callback(response)
				return
			}
	});
}

router.search = function(req, callback) {

	db.query('SELECT products.id,products.name,products.price,brands.brand,categories.category  FROM products INNER JOIN brands on products.brand = brands.id INNER JOIN categories ON products.category = categories.id WHERE products.name = ?', [req.body.name] , function(err, rows) {
			if(err) {
				var response = {error : true}
				response.message = "Failed to Serach";
				response.response_code = -1
				debugger
				callback(response)
				return
			} 
			else {
				if(rows.length == 0){
					var response = {error : true}
					response.message = "No Results Found" ;
					response.response_code = 0
					callback(response)
					return				
				}
				else{
					var response = {error : false}
					response.message = "Returning Results";
					response.response_code = 1
					response.data = rows
					callback(response)
					return
				}
			}
	});
}

router.edit = function(req, callback) {
	var id = req.body.id || req.query.id
	var fields = req.body.fields || req.query.fields
	fields = JSON.parse(fields) 
	var keys = Object.keys(fields)
	console.log('keys : ' + keys, keys.length, fields)
	if (keys.length == 0){
		var response = {error : false}
		response.message = "Nothing to update";
		response.response_code = 2
		callback(response)
		return
	}
	else{
		var sql = 'UPDATE products SET '
		var iterations = keys.length
		keys.forEach(function(key){
			if(table_mappings[key]){
				var table_name = table_mappings[key]
				console.log('SELECT id FROM ' + table_name + ' WHERE '  + key + ' = "' + fields[key] + '"')
				db.query('SELECT id FROM ' + table_name + ' WHERE '  + key + ' = "' + fields[key] + '"',[], function(err,rows){
					iterations -= 1
					if(err){
						var response = {error : true}
						response.error = true;
						response.message = "Failed to get " ;
						response.response_code = -1
						debugger
						callback(response)
						return
					}
					else{
						if(rows.length == 0){
							var response = {error : true}
							response.error = true;
							response.message = key + " doesn't Exist" ;
							response.response_code = 0
							debugger
							callback(response)
							return				
						}
						else{
							sql +=  key + ' = "' + rows[0].id + '",'
							if(iterations == 0){
								sql = sql.slice(0,-1)
								sql += ' WHERE id = ' + id
								console.log(sql)
								db.query(sql,[],function(err,rows){
									if(err){
										var response = {error : true}
										response.error = true;
										response.message = "Failed edit product";
										response.response_code = -1
										debugger
										callback(response)
										return
									}
									else{
										var response = {error : false}
										response.message = "edited product successfully";
										response.response_code = 1
										callback(response)
										return
									}
								})
							}
						}
					}
				})
			}
			else{
				iterations -= 1
				sql += key + ' = "' + fields[key] + '",'
				if(iterations == 0){
					sql = sql.slice(0,-1)
					sql += ' WHERE id = ' + id
					console.log(sql)
					db.query(sql,[],function(err,rows){
						if(err){
							var response = {error : true}
							response.error = true;
							response.message = "Failed edit product";
							response.response_code = -1
							debugger
							callback(response)
							return
						}
						else{
							var response = {error : false}
							response.message = "edited product successfully";
							response.response_code = 1
							callback(response)
							return
						}
					})
				}
			}
		})

	}
}

router.post('/search', function (req, res) {
	router.search(req, function(response) {
		res.send(response)
	});
});

router.post('/edit', function (req, res) {
	router.edit(req, function(response) {
		res.send(response)
	});
});

router.post('/delete', function (req, res) {
	router.delete(req, function(response) {
		res.send(response)
	});
});

router.post('/add', function (req, res) {
	router.add(req, function(response) {
		res.send(response)
	});
});

module.exports = router

