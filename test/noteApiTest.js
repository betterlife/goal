"use strict";
var should     = require('should');
var assert     = require('assert');
var request    = require('supertest');
var mongoose   = require('mongoose');
var testUtil   = require('./../app/util/testUtil');
var testConfig = require('./../app/util/testConfig');
var app        = require('../app/app');

describe('Routing', function () {
    var url = testConfig.url;

    before(function (done) {
        app.startServer(testConfig.serverConfig);
        done();
    });

    after(function (done) {
        app.stopServer();
        done();
    });

    describe('Note object CRUD API', function () {
    });
});
