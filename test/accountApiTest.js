var should     = require('should');
var assert     = require('assert');
var request    = require('supertest');
var mongoose   = require('mongoose');
var testUtil   = require('../app/util/testUtil');
var testConfig = require('../app/util/testConfig');
var app        = require('../app/app');

describe('Account API', function () {
    "use strict";
    var url = testConfig.url;
    var dummyUser = {
        '_id'      : mongoose.Types.ObjectId('123456789012'),
        'username' : "testUser",
        'password' : "password",
        'email'    : "test@test.com",
        'nickname' : "Test user"
    };
    var createUser = {
        '_id'      : mongoose.Types.ObjectId('123456789013'),
        'username' : "testCreateUser",
        'password' : "password",
        'email'    : "test@test1.com",
        'nickname' : "Test create user"
    };
    before(function (done) {
        app.startServer(testConfig.serverConfig);
        testUtil.removeAllAccounts();
        done();
    });

    after(function (done) {
        app.stopServer();
        testUtil.removeAllAccounts();
        done();
    });

    beforeEach(function (done) {
        request(url).post('/api/register')
            .send({"account" : dummyUser}).expect(200, done);
    });
    
    afterEach(function (done) {
        testUtil.removeAllAccounts();
        done();
    });

    describe('Account object CRUD', function () {
        it('Create account object', function (done) {
            request(url).post('/api/register')
                .set('Accept', 'application/json')
                .send({"account" : createUser})
                .end(function (err, res) {
                    testUtil.assertDefined(res);
                    testUtil.assertDefined(res.body);
                    testUtil.assertAccountObj(createUser, res.body);
                    testUtil.done(err, res, done);
                });
        });

        it('Login use correct password', function (done) {
            request(url).post('/api/login')
                .set('Accept', 'application/json')
                .send({
                    'username' : dummyUser.username,
                    'password' : dummyUser.password
                }).end(function (err, res) {
                    assert.equal(err, null, "Error is not null");
                    assert.equal(res.statusCode, 200, "statusCode is not 200");
                    assert.equal(res.body.user.username, dummyUser.username);
                    assert.equal(res.body.user.email, dummyUser.email);
                    assert.equal(res.body.user.nickname, dummyUser.nickname);
                    assert.equal(res.body.user._id, dummyUser._id);
                    done();
                });
        });

        it('Login use wrong password', function (done) {
            request(url).post('/api/login')
                .set('Accept', 'application/json')
                .send({
                    'username' : dummyUser.username,
                    'password' : dummyUser.password + "123"
                }).end(function (err, res) {
                    assert.equal(err, null, "Error is not null");
                    assert.equal(res.statusCode, 401, "statusCode is not 401 using wrong password");
                    assert.equal(res.body.user, null, "user in req body is not null");
                    assert.equal(res.text, "Unauthorized");
                    done();
                });

        });

    });
});
