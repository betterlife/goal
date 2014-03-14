var express = require('express');
var indexRoute = require('./routes/index');
var goalRouter = require('./routes/goal.js');
var srRouter = require('./routes/sr.js');
var accountRouter = require('./routes/account.js');
var http = require('http');
var path = require('path');
var mongodbUrl = process.env.MONGOHQ_URL || process.env.MONGO_TEST_URL ||'mongodb://localhost/development';
var persistent = require('mongoose');
persistent.connect(mongodbUrl);

var mainApp = express();
var server = http.createServer(mainApp);

var setAppParameters = function(app, serverConfig) {
    app.set('port', serverConfig.port);
    app.set('env', serverConfig.env);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.logger(serverConfig.logger));
    app.configure('development', function(){
      app.locals.pretty = true;
    });
};

var setRouters = function(app) {
    goalRouter.registerMe(app);
    srRouter.registerMe(app);
    accountRouter.registerMe(app);
    indexRoute.registerMe(app);
    indexRoute.catchAll(app);
};

exports.startServer = function(serverConfig) {
    setAppParameters(mainApp, serverConfig);
    setRouters(mainApp);
    if (serverConfig.env === 'development') {
        try {
            var reload = require('reload');
            reload(server, mainApp);
        } catch(e) {
            if ( e.code === 'MODULE_NOT_FOUND' ) {
                console.info('Reload module was not found'); 
            }
        }
        mainApp.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }
    server.listen(mainApp.get('port'), function () {
    });
};

exports.stopServer = function() {
    server.close();
};
