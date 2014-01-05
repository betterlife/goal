"use strict";
var express = require('express');
var routes = require('./routes/index');
var goalRouter = require('./routes/goal.js');
var http = require('http');
var path = require('path');

var app = express();

// all environments
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

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('/goals', goalRouter.list);
app.post('/goals', goalRouter.create);
app.get('/goals/:id', goalRouter.get);
app.put('/goals/:id', goalRouter.update);
app.delete('/goals/:id', goalRouter.remove);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});