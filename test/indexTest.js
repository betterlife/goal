"use strict";
var should     = require('should');
var assert     = require('assert');
var request    = require('supertest');
var mongoose   = require('mongoose');
var testUtil   = require('../app/util/testUtil');
var app        = require('../app/app');
var testConfig = require('../app/util/testConfig');

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

    describe('Index', function () {
        it('Index page should be accessable', function (done) {
            request(url).get('/')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(200)
                .end(function (err, res) {
                    return testUtil.done(err, res, done);
                });
        });
        testUtil.textVerify('Goals', url, '');
        testUtil.textVerify('Home', url, '');
        testUtil.textVerify('Login', url, '');
        testUtil.textVerify('Register', url, '');
    });
});
