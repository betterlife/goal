"use strict";
var express = require('express'),
    indexRoute = require('./routes/index'),
    goalRouter = require('./routes/goal.js'),
    accountRouter = require('./routes/account.js'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    mongodbUrl = process.env.MONGOHQ_URL || process.env.MONGO_TEST_URL || 'mongodb://localhost/development',
    mongoose = require('mongoose');

mongoose.connect(mongodbUrl);

var mainApp = express();
var server = http.createServer(mainApp);

var setAppParameters = function (app, serverConfig) {
    app.set('port', serverConfig.port);
    app.set('env', serverConfig.env);
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'jade');
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, '/../public')));
    app.use(express.logger(serverConfig.logger));
    app.configure('development', function () {
        app.locals.pretty = true;
    });
};

var setRouters = function (app) {
    goalRouter.registerMe(app);
    accountRouter.registerMe(app);
    indexRoute.registerMe(app);
    indexRoute.catchAll(app);
};

exports.startServer = function (serverConfig) {
    setAppParameters(mainApp, serverConfig);
    setRouters(mainApp);
    if (serverConfig.env === 'development') {
        try {
            var reload = require('reload');
            reload(server, mainApp);
        } catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                console.info('Reload module was not found');
            }
        }
        mainApp.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }
    server.listen(mainApp.get('port'), function () {
    });
};

exports.stopServer = function () {
    server.close();
};
