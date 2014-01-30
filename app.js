var express = require('express');
var routes = require('./routes/index');
var goalRouter = require('./routes/goal.js');
var http = require('http');
var path = require('path');

var goalApp = express();
var server = http.createServer(goalApp);

var setAppParameters = function(app) {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.set('env', 'development');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
};

var setRouters = function(app) {
    app.get('/', routes.index);
    app.get('/partials/:name', routes.partials);

    app.get('/goals', goalRouter.list);
    app.post('/goals', goalRouter.create);
    app.get('/goals/:id', goalRouter.get);
    app.put('/goals/:id', goalRouter.update);
    app.delete('/goals/:id', goalRouter.remove);
};

exports.startServer = function() {
    setAppParameters(goalApp);
    setRouters(goalApp);
    server.listen(goalApp.get('port'), function () {
        console.log('Express server listening on port ' + goalApp.get('port'));
    });
};

exports.stopServer = function() {
    server.close();
};
