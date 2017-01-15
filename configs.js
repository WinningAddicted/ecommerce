//Used to configure app.js
var appConfigs = {
    bodyParserLimit: '500mb',
    port: 3000
}

//Used to configure databaseConnection.js
var databaseConfigs = {
    host: 'localhost',
    user: 'root',
    password: 'pika',
    database: 'wingify_yatharth',
    checkInterval: 500,
    queryTimeout: 3000,
    insecureAuth: true
}

//Used to configure test scripts
var testConfigs = {
    host: 'localhost',
    port: appConfigs.port
}

//Used to configure auth-token and password hash
var securityConfigs = {
    saltRounds: 10,
    secretKey: 'wingify',
    tokenTimeout: '30m'
}

exports.databaseConfigs = databaseConfigs;
exports.appConfigs = appConfigs;
exports.testConfigs = testConfigs;
exports.securityConfigs = securityConfigs;