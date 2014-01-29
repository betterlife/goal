var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var testUtil = require('./testUtil');
var server = require('../app');

describe('Routing', function() {
    var url = 'http://localhost:3000';
    
    before(function(done) {
        done();
    });

    describe('Index', function() {
        it('Index page should be accessable', function(done) {
            request(url).get('/')                
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(200)
                .end(function(err, res) {
                    return testUtil.done(err, res, done);
                });
        });
        testUtil.textVerify('Home', url, '');
        testUtil.textVerify('List All Goals', url, '');
        testUtil.textVerify('New Goal', url, '');
        testUtil.textVerify('<div ng-view="ng-view"></div>', url, '');
    });
});
