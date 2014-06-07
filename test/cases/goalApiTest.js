var should     = require('should');
var assert     = require('assert');
var request    = require('superagent');
var mongoose   = require('mongoose');
var testUtil   = require('./../util/testUtil');
var testConfig = require('./../util/testConfig');
var app        = require('../../app/app');
var userAgent  = request.agent();

describe('Goal and goal notes API', function () {
    "use strict";
    var url = testConfig.url;
    var id = mongoose.Types.ObjectId('123456789012');
    var insertId =  mongoose.Types.ObjectId('123456789ABC');
    var goalObj = {
        '_id'         : id,
        'title'       : 'Sample Title for Read Update',
        'description' : 'Sample Description for Read Update',
        'type'        : 'Long term(10 to 20 Year)',
        'status'      : 'New',
        'createDate'  : new Date(),
        'dueDate'     : new Date()
    };

    var dummyUser = testConfig.dummyUser;

    var updatedGoalObj = {
        'title'       : 'Updated title',
        'description' : 'Updated description',
        'type'        : 'Annually',
        'status'      : 'In Progress'
    };

    var insertGoalObj = {
        '_id'         : insertId,
        'title'       : 'Sample Title for Insert',
        'description' : 'Sample Description for Insert',
        'type'        : 'Annually',
        'status'      : 'In Progress',
        'createDate'  : new Date(),
        'dueDate'     : new Date()
    };

    var decorateSession = function (callback) {
        testUtil.decorateSession(userAgent, callback);
    };
    
    before(function (done) {
        app.startServer(testConfig.serverConfig);
        testUtil.cleanData();
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
        testUtil.cleanData();
        done();
    });
    
    describe('Goal object CRUD ', function () {
        it('Create goal object', function (done) {
            decorateSession(function (err, res) {
                testUtil.assertNormalStatus(err, res);
                userAgent.post(url + '/api/goals')
                    .send({'goal': insertGoalObj})
                    .end(function (err, res) {
                        testUtil.assertNormalStatus(err, res);
                        testUtil.assertDefined(res);
                        testUtil.assertDefined(res.body);
                        testUtil.assertGoalObj(insertGoalObj, res.body);
                        done();
                    });
            });
        });

        it('Read goal object', function (done) {
            decorateSession(function (err, res) {
                testUtil.assertNormalStatus(err, res);
                userAgent.post(url + '/api/goals')
                    .send({'goal': goalObj})
                    .end(function (err, res) {
                        testUtil.assertNormalStatus(err, res);
                        userAgent.get(url + '/api/goals/' + id)
                            .set('Accept', 'application/json')
                            .end(function (err, res) {
                                testUtil.assertNormalStatus(err, res);
                                testUtil.assertDefined(res);
                                testUtil.assertDefined(res.body);
                                testUtil.assertDefined(res.body.goal);
                                testUtil.assertGoalObj(goalObj, res.body.goal);
                                done();
                            });
                    });
            });
        });

        it('Update goal object', function (done) {
            decorateSession(function (err, res) {
                testUtil.assertNormalStatus(err, res);
                userAgent.post(url + '/api/goals')
                    .send({'goal': goalObj})
                    .end(function (err, res) {
                        testUtil.assertNormalStatus(err, res);
                        userAgent.put(url + '/api/goals/' + id)
                            .send({'goal' : updatedGoalObj})
                            .end(function (err, res) {
                                testUtil.assertNormalStatus(err, res);
                                testUtil.assertDefined(res);
                                testUtil.assertDefined(res.body);
                                testUtil.assertDefined(res.body.goal);
                                updatedGoalObj._id = id;
                                updatedGoalObj.createDate = goalObj.createDate;
                                updatedGoalObj.dueDate    = goalObj.dueDate;
                                testUtil.assertGoalObj(updatedGoalObj, res.body.goal);
                                done();
                            });
                    });
            });
        });
        it('Delete goal object', function (done) {
            decorateSession(function (err, res) {
                testUtil.assertNormalStatus(err, res);
                userAgent.post(url + '/api/goals')
                    .send({'goal': insertGoalObj})
                    .end(function (err, res) {
                        testUtil.assertNormalStatus(err, res);
                        testUtil.assertDefined(res);
                        testUtil.assertDefined(res.body);
                        testUtil.assertGoalObj(insertGoalObj, res.body);
                        userAgent.get(url + '/api/goals/' + insertId)
                            .set('Accept', 'application/json')
                            .end(function (err, res) {
                                testUtil.assertNormalStatus(err, res);
                                testUtil.assertDefined(res);
                                testUtil.assertDefined(res.body);
                                testUtil.assertDefined(res.body.goal);
                                testUtil.assertGoalObj(insertGoalObj, res.body.goal);
                                userAgent.del(url + '/api/goals/' + insertId).end(function (err, res) {
                                    testUtil.assertNormalStatus(err, res);
                                    done();
                                });
                            });
                    });
            });
        });
    });
});
