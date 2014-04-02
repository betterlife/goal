"use strict";
require('newrelic');
var app = require("./app");
var serverConfig = {
    'port'   : process.env.PORT || 3000,
    'env'    : process.env.NODE_ENV || 'development',
    'logger' : process.env.NODE_LOGGER || 'dev',
    'reload' : false
};
app.startServer(serverConfig);
