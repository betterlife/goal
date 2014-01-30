"use strict";
require('newrelic');
var app = require("./app");
app.startServer(3000);
