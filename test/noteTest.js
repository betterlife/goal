var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var testUtil = require('./testUtil');
var app = require('../app');
var port = 3001;

describe('Routing', function() {
    var url = 'http://localhost:' + port;
    
    before(function(done) {
        app.startServer(port);
        done();
    });

    after(function(done) {
        app.stopServer();
        done();
    });

    describe('Note', function() {
    });
});
