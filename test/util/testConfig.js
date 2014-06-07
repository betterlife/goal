var mongoose   = require('mongoose');

var serverConfig = {
    'port'   : 3001,
    'env'    : 'testing',
     //To skip log output during testing, set to dev to show logs
    'logger' : 'development'
};

var url = 'http://localhost:' + serverConfig.port;
process.env.MONGO_TEST_URL = 'mongodb://localhost/test';

exports.serverConfig = serverConfig;
exports.url = url;
exports.dummyUser =  {
    '_id': mongoose.Types.ObjectId('123456789012'),
    'username': "testUser",
    'password': "password",
    'email': "test@test.com",
    'nickname': "Test user"
};