"use strict";
var mongoose              = require('mongoose'),
    Schema                = mongoose.Schema,
    model,
    passport              = require('passport'),
    LocalStrategy         = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose');

exports.getSchema = function (Schema) {
    var schema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        nickname: String
    });
    schema.plugin(passportLocalMongoose);
    return schema;
};

exports.getModel = function () {
    if (model === undefined) {
        model = mongoose.model('Account', exports.getSchema(Schema));
    }
    return model;
};

passport.use(new LocalStrategy(exports.getModel().authenticate()));
passport.serializeUser(exports.getModel().serializeUser());
passport.deserializeUser(exports.getModel().deserializeUser());
exports.getPassport = passport;
