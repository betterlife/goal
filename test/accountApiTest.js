var should = require('should');
var assert = require('assert');
var superTest = require('supertest');
var superAgent = require('superagent');
var userAgent  = superAgent.agent();
var mongoose = require('mongoose');
var testUtil = require('./../app/util/testUtil');
var testConfig = require('./../app/util/testConfig');
var commonUtil = require('../app/util/commonUtil');
var app = require('../app/app');

describe('Account API', function () {
    "use strict";
    var url = testConfig.url;
    var dummyUser = testConfig.dummyUser;
    var insertId =  mongoose.Types.ObjectId('123456789ABC');
    var insertGoalObj = {
        '_id'         : insertId,
        'title'       : 'Sample Title for Insert',
        'description' : 'Sample Description for Insert',
        'type'        : 'Annually',
        'status'      : 'In Progress',
        'createDate'  : new Date(),
        'dueDate'     : new Date()
    };

    var createUser = {
        '_id': mongoose.Types.ObjectId('123456789013'),
        'username': "testCreateUser",
        'password': "password",
        'email': "test@test1.com",
        'nickname': "Test create user"
    };

    before(function (done) {
        app.startServer(testConfig.serverConfig);
        testUtil.removeAllAccounts();
        testUtil.removeAllGoals();
        done();
    });

    after(function (done) {
        app.stopServer();
        done();
    });

    beforeEach(function (done) {
        userAgent.post(url + '/api/register')
            .send({"account": dummyUser})
            .end(function (err, res) {
                testUtil.assertNormalStatus(err, res);
                done();
            });
    });

    afterEach(function (done) {
        testUtil.removeAllAccounts();
        testUtil.removeAllGoals();
        done();
    });

    var testLogin = function (username, password, done, asserts) {
        superTest(url).post('/api/login')
            .set('Accept', 'application/json')
            .send({
                'username': username,
                'password': password
            }).end(function (err, res) {
                asserts(err, res);
                done();
            });
    };

    var testWrongLogin = function (username, password, done) {
        testLogin(username, password, done, function (err, res) {
            assert.equal(err, null, "Error is not null");
            assert.equal(res.statusCode, 401, "statusCode is not 401 using wrong password");
            assert.equal(res.body.user, null, "user in req body is not null");
            assert.equal(res.text, "Unauthorized");
        });
    };

    var testCreateAccount = function (userObj, done, asserts) {
        superTest(url).post('/api/register')
            .set('Accept', 'application/json')
            .send({"account": userObj})
            .end(function (err, res) {
                asserts(err, res);
                if (null !== done) {
                    testUtil.done(err, res, done);
                }
            });
    };

    var testCreateAccountFail = function (userObj, errorObj, done) {
        testCreateAccount(userObj, null, function (err, res) {
            if (null !== errorObj) {
                assert.deepEqual(res.body.error, errorObj);
            }
            testWrongLogin(userObj.username, userObj.password, done);
        });
    };

    describe('Create account', function () {

        it('Create account object successfully', function (done) {
            testCreateAccount(createUser, done, function (err, res) {
                testUtil.assertDefined(res);
                testUtil.assertDefined(res.body);
                testUtil.assertAccountObj(createUser, res.body);
            });
        });

        it('Create account object with no username', function (done) {
            var tempUser = commonUtil.clone(createUser);
            tempUser.username = null;
            testCreateAccountFail(tempUser, {
                name: 'BadRequestError',
                message: 'Field username is not set'
            }, done);
        });

        it('Create account object with no password', function (done) {
            var tempUser = commonUtil.clone(createUser);
            tempUser.password = null;
            testCreateAccountFail(tempUser, {
                name: 'BadRequestError',
                message: 'Password argument not set!'
            }, done);
        });

        it('Create account object with no email address', function (done) {
            var tempUser = commonUtil.clone(createUser);
            tempUser.email = null;
            testCreateAccountFail(tempUser, null, done);
        });
    });

    describe('Login', function () {
        it('Login use correct password', function (done) {
            testLogin(dummyUser.username, dummyUser.password, done,
                function (err, res) {
                    assert.equal(err, null, "Error is not null");
                    assert.equal(res.statusCode, 200, "statusCode is not 200");
                    assert.equal(res.body.user.username, dummyUser.username);
                    assert.equal(res.body.user.email, dummyUser.email);
                    assert.equal(res.body.user.nickname, dummyUser.nickname);
                    assert.equal(res.body.user._id, dummyUser._id);
                });
        });

        it('Login use wrong password', function (done) {
            testWrongLogin(dummyUser.username, dummyUser.password + "123", done);
        });

        it('Login use empty password', function (done) {
            testWrongLogin(dummyUser.username, '', done);
        });
    });

    describe('Logout', function () {
        it('User should be able to logout', function (done) {
            testUtil.decorateSession(userAgent, function (err, res) {
                testUtil.assertNormalStatus(err, res);
                userAgent.get(url + "/api/logout").end(
                    function (err, res) {
                        testUtil.assertNormalStatus(err, res);
                        res.redirects.should.eql(['http://localhost:' + testConfig.serverConfig.port + "/login"]);
                        done();
                    });
            });
        });
    });

    describe('Invoke API', function () {
        it('User should not be able to invoke API before login', function (done) {
            userAgent.post(url + '/api/goals')
                .send({'goal': insertGoalObj})
                .end(function (err, res) {
                    testUtil.assertNormalStatus(err, res);
                    testUtil.assertDefined(res);
                    testUtil.assertDefined(res.body);
                    assert.deepEqual(res.body, {
                        "error": true,
                        "errorCode": 1
                    }, "User should not pass authentication check when invoke API before login");
                    testUtil.decorateSession(userAgent, function (err, res) {
                        testUtil.assertNormalStatus(err, res);
                        userAgent.get(url + '/api/goals/' + insertGoalObj._id)
                            .set('Accept', 'application/json')
                            .end(function (err, res) {
                                testUtil.assertNormalStatus(err, res);
                                testUtil.assertDefined(res);
                                testUtil.assertDefined(res.body);
                                should.equal(res.body.goal, null,
                                    "Data should not be inserted into DB if invoke API before login");
                                done();
                            });
                    });
                });
        });
    });
});
