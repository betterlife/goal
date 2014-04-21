"use strict";
var should     = require('should');
var assert     = require('assert');
var request    = require('supertest');
var mongoose   = require('mongoose');
var testUtil   = require('./../app/util/testUtil');
var testConfig = require('./../app/util/testConfig');
var app        = require('../app/app');

describe('API', function () {
    var url = 'http://localhost';
    var devServerConfig = {
        'port'   : 3001,
        'env'    : 'development',
        'logger' : 'dev'
    };
    var testingServerConfig = {
        'port'   : 3002,
        'env'    : 'testing',
        'logger' : 'dev'
    };
    var prdServerConfig = {
        'port'   : 3003,
        'env'    : 'production',
        'logger' : 'dev'
    };

    function runTest(serverConfig) {
        it(serverConfig.env, function (done) {
            var serverUrl = url + ":" + serverConfig.port;
            app.startServer(serverConfig);
            request(serverUrl).get('/')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(200)
                .end(function (err, res) {
                    app.stopServer();
                    return testUtil.done(err, res, done);
                });
        });
    }

    describe('Start server in dev model', function () {
        runTest(devServerConfig);
    });

    describe('Start server in testing model', function () {
        runTest(testingServerConfig);
    });

    describe('Start server in prd model', function () {
        runTest(prdServerConfig);
    });
});
