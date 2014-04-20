var should     = require('should');
var assert     = require('assert');
var request    = require('supertest');
var mongoose   = require('mongoose');
var testUtil   = require('../app/util/testUtil');
var testConfig = require('../app/util/testConfig');
var app        = require('../app/app');

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
        'createDate'  : new Date()
    };

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
        'createDate'  : new Date()
    };
    
    before(function (done) {
        app.startServer(testConfig.serverConfig);
        testUtil.removeAllGoals();
        done();
    });

    after(function (done) {
        app.stopServer();
        testUtil.removeAllGoals();
        done();
    });

    beforeEach(function (done) {
        request(url).post('/api/goals').send({'goal' : goalObj}).expect(200, done);
    });

    afterEach(function (done) {
        testUtil.removeAllGoals();
        done();
    });
    
    describe('Goal object CRUD ', function () {
        it('Create goal object', function (done) {
            request(url).post('/api/goals')
                .set('Accept', 'application/json')
                .send({'goal': insertGoalObj})
                .end(function (err, res) {
                    testUtil.assertDefined(res);
                    testUtil.assertDefined(res.body);
                    testUtil.assertGoalObj(insertGoalObj, res.body);
                    request(url).del('/api/goals/' + insertId).expect(200,done);
                });
        });

        it('Read goal object', function (done) {
            request(url)
                .get('/api/goals/' + id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    testUtil.assertDefined(res);
                    testUtil.assertDefined(res.body);
                    testUtil.assertDefined(res.body.goal);
                    testUtil.assertGoalObj(goalObj, res.body.goal);
                    done();
                });
        });
        it('Update goal object', function (done) {
            request(url)
                .put('/api/goals/' + id)
                .send({'goal' : updatedGoalObj})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    testUtil.assertDefined(res);
                    testUtil.assertDefined(res.body);
                    testUtil.assertDefined(res.body.goal);
                    updatedGoalObj._id = id;
                    updatedGoalObj.createDate = goalObj.createDate;
                    testUtil.assertGoalObj(updatedGoalObj, res.body.goal);
                    done();
                });
        });
        it('Delete goal object', function (done) {
            request(url)
                .get('/api/goals/' + id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    testUtil.assertDefined(res);
                    testUtil.assertDefined(res.body);
                    testUtil.assertDefined(res.body.goal);
                    testUtil.assertGoalObj(goalObj, res.body.goal);
                });
            request(url).del('/api/goals/' + id).expect(200, function (err, res) {
                request(url)
                    .get('/api/goals/' + id)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200).end(function (err, res) {
                        testUtil.assertDefined(res);
                        testUtil.assertDefined(res.body);
                        assert.equal(res.body.goal, null);
                        done();
                    });
            });
        });
    });
});
