//Libraries
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

//Files
var db = require('../../databaseConnection');
var utils = require('./utils');

// configs
var securityConfigs = require('../../configs').securityConfigs
const saltRounds = securityConfigs.saltRounds;
const table_mappings = {
    "category": "categories",
    "brand": "brands"
};
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
router.getBrandId = function(req, callback) {
    /**
     * Used to get brand ID.
     * @param {string} brand - The name of the brand.
     */

    var brand = req.body.brand || req.query.brand;

    if (brand) {
        db.query('SELECT id FROM brands WHERE brand = ?', [brand], function(err, rows) {
            if (err) {
                var message = "Failed to get brands";
                utils.sendResponse(true, message, -1, err, function(response) {
                    callback(response);
                    return;
                });
            }
            else {
                if (!rows.length) {
                    var message = "Brand Doesn't Exist. Please Register Brand";
                    utils.sendResponse(true, message, 2, null, function(response) {
                        callback(response);
                        return;
                    });
                }
                else {
                    var brandId = rows[0].id;
                    var message = "Returning brand id";
                    utils.sendResponse(false, message, 1, brandId, function(response) {
                        callback(response);
                        return;
                    });
                }
            }
        });
    }
    else {
        var message = "brand is required field";
        utils.sendResponse(true, message, -2, null, function(response) {
            callback(response);
            return;
        });
    }

}

router.getCategoryId = function(req, callback) {
    /**
     * Used to get category ID.
     * @param {string} brand - The name of the brand.
     */

    var category = req.body.category || req.query.category;

    if (category) {
        db.query('SELECT id FROM categories WHERE category = ?', [category], function(err, rows) {
            if (err) {
                var message = "Failed to get category";
                utils.sendResponse(true, message, -1, err, function(response) {
                    callback(response);
                    return;
                });
            }
            else {
                if (!rows.length) {
                    var message = "Category Doesn't Exist. Please Register Category";
                    utils.sendResponse(true, message, 3, null, function(response) {
                        callback(response);
                        return;
                    });
                }
                else {
                    var categoryId = rows[0].id;
                    var message = "Returning category id";
                    utils.sendResponse(false, message, 1, categoryId, function(response) {
                        callback(response);
                        return;
                    });
                }
            }
        });
    }
    else {
        var message = "category is required field";
        utils.sendResponse(true, message, -2, null, function(response) {
            callback(response);
            return;
        });
    }

}

router.add = function(req, callback) {
    /**
     * Used to add a new product.
     * @param {string} token - The auth-token for route middleware.
     * @param {string} brand - The brand of new product.
     * @param {string} name - The name of new product.
     * @param {string} price - The price of new product.
     * @param {string} category - The category of new product.
     */

    var brand = req.body.brand || req.query.brand;
    var category = req.body.category || req.query.category;
    var name = req.body.name || req.query.name;
    var price = req.body.price || req.query.price;

    if (brand && category && name && price) {
        router.getBrandId(req, function(response) {
            if (response.error) {
                callback(response);
                return;
            }
            else {
                var brand = response.data;
                router.getCategoryId(req, function(resp) {
                    if (resp.error) {
                        callback(resp);
                        return;
                    }
                    else {
                        var category = resp.data;
                        db.query('INSERT INTO products(name, brand, category,price) VALUES(?,?,?,?)', [name, brand, category, price], function(err, rows) {
                            if (err) {
                                var message = "Failed to add product";
                                utils.sendResponse(true, message, -1, err, function(response) {
                                    callback(response);
                                    return;
                                });
                            }
                            else {
                                var message = "Added product successfully";
                                utils.sendResponse(false, message, 1, null, function(response) {
                                    callback(response);
                                    return;
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        var message = "brand,category,name and price are required fields";
        utils.sendResponse(true, message, -2, null, function(response) {
            callback(response);
            return;
        });
    }
}

router.delete = function(req, callback) {
    /**
     * Used to delete a product.
     * @param {string} token - The auth-token for route middleware.
     * @param {string} id - The id product to delete.
     */

    var id = req.body.id || req.query.id;

    if (id) {
        db.query('DELETE FROM products WHERE id = ?', [req.body.id], function(err, rows) {
            if (err) {
                var message = "Product Deleted";
                utils.sendResponse(true, message, -1, err, function(response) {
                    callback(response);
                    return;
                });
            }
            else {
                var message = "Deleted product successfully";
                utils.sendResponse(false, message, 1, null, function(response) {
                    callback(response);
                    return;
                });
            }
        });
    }
    else {
        var message = "id is required field";
        utils.sendResponse(true, message, -2, null, function(response) {
            callback(response);
            return;
        });
    }
}

router.search = function(req, callback) {
    /**
     * Used to search a product.
     * @param {string} token - The auth-token for route middleware.
     * @param {string} name - The name product to search.
     */

    var name = req.body.name || req.query.name;

    if (name) {
        db.query('SELECT products.id,products.name,products.price,brands.brand,categories.category  FROM products INNER JOIN brands on products.brand = brands.id INNER JOIN categories ON products.category = categories.id WHERE products.name = ?', [name], function(err, rows) {
            if (err) {
                var message = "Failed to Serach";
                utils.sendResponse(true, message, -1, err, function(response) {
                    callback(response);
                    return;
                });
            }
            else {
                if (!rows.length) {
                    var message = "No Results Found";
                    utils.sendResponse(false, message, 0, null, function(response) {
                        callback(response);
                        return;
                    });
                }
                else {
                    var message = "Returning Results";
                    utils.sendResponse(false, message, 1, rows, function(response) {
                        callback(response);
                        return;
                    });
                }
            }
        });
    }
    else {
        var message = "name is required field";
        utils.sendResponse(true, message, -2, null, function(response) {
            callback(response);
            return;
        });
    }
}

router.edit = function(req, callback) {
    /**
     * Used to edit a product.
     * @param {string} token - The auth-token for route middleware.
     * @param {string} id - The id product to edit.
     * @param {object} fields - The fields of product to edit {fieldName : fieldValue}.
     */

    var id = req.body.id || req.query.id;
    var responded = false;
    var fields = req.body.fields || req.query.fields;

    //Check Required fields
    if (id && fields) {
        fields = JSON.parse(fields)
        var keys = Object.keys(fields);

        //Verify fields is not an empty JSON Object
        if (!keys.length) {
            var message = "Nothing to update";
            utils.sendResponse(false, message, 2, null, function(response) {
                responded = true;
                callback(response);
                return;
            });
        }
        else {
            //Generating MySQL Query
            var sql = 'UPDATE products SET ';
            var iterations = keys.length;

            //Iterate for all fields
            keys.forEach(function(key) {
                //If column is a foriegn key (brand or category)
                if (table_mappings[key]) {
                    //Get which table to hit
                    var table_name = table_mappings[key];
                    //Get Foreign key id
                    db.query('SELECT id FROM ' + table_name + ' WHERE ' + key + ' = "' + fields[key] + '"', [], function(err, rows) {
                        iterations -= 1
                        if (err) {
                            if (!responded) {
                                var message = "Failed to get" + key;
                                utils.sendResponse(true, message, -1, err, function(response) {
                                    responded = true;
                                    callback(response);
                                    return;
                                });
                            }
                        }
                        else {
                            //Check if trying to add unregisterd brand or category 
                            if (!rows.length) {
                                if (!responded) {
                                    var message = key + " doesn't Exist";
                                    utils.sendResponse(false, message, 0, null, function(response) {
                                        responded = true;
                                        callback(response);
                                        return;
                                    });
                                }
                            }
                            else {
                                //Add Field to the MySQL Query
                                sql += key + ' = "' + rows[0].id + '",';

                                //if done iterating over all fields
                                if (iterations == 0) {

                                    //Remove trailing ","
                                    sql = sql.slice(0, -1);
                                    sql += ' WHERE id = ' + id;

                                    db.query(sql, [], function(err, rows) {
                                        if (err) {
                                            if (!responded) {
                                                var message = "Failed edit product";
                                                utils.sendResponse(true, message, -1, err, function(response) {
                                                    responded = true;
                                                    callback(response);
                                                    return;
                                                });
                                            }
                                        }
                                        else {
                                            if (!responded) {
                                                var message = "Edit successfully done";
                                                utils.sendResponse(false, message, 1, null, function(response) {
                                                    responded = true;
                                                    callback(response);
                                                    return;
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
                else {
                    // For columns that are not foriegn key
                    iterations -= 1;
                    sql += key + ' = "' + fields[key] + '",';

                    if (iterations == 0) {

                        //Remove trailing ","
                        sql = sql.slice(0, -1);
                        sql += ' WHERE id = ' + id;

                        db.query(sql, [], function(err, rows) {
                            if (err) {
                                if (!responded) {
                                    var message = "Failed edit product";
                                    utils.sendResponse(true, message, -1, err, function(response) {
                                        responded = true;
                                        callback(response);
                                        return;
                                    });
                                }
                            }
                            else {
                                if (!responded) {
                                    var message = "Edit successfully done";
                                    utils.sendResponse(false, message, 1, null, function(response) {
                                        responded = true;
                                        callback(response);
                                        return;
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    }
    else {
        var message = "id, fields are required field";
        utils.sendResponse(true, message, -2, null, function(response) {
            callback(response);
            return;
        });
    }
}

router.post('/search', function(req, res) {
    router.search(req, function(response) {
        res.send(response)
    });
});

router.post('/edit', function(req, res) {
    router.edit(req, function(response) {
        res.send(response)
    });
});

router.post('/delete', function(req, res) {
    router.delete(req, function(response) {
        res.send(response)
    });
});

router.post('/add', function(req, res) {
    router.add(req, function(response) {
        res.send(response)
    });
});

module.exports = router