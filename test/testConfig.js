var serverConfig = {
    'port'   : 3001, 
    'env'    : 'testing', 
    //To skip log output during testing, set to dev to show logs
    'logger' : 'dev'
};

var url = 'http://localhost:' + serverConfig.port;
process.env.MONGO_TEST_URL = 'mongodb://localhost/test';

exports.serverConfig = serverConfig;
exports.url = url;
