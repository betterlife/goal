"use strict";
var mongoose              = require('mongoose'),
    Schema                = mongoose.Schema,
    model,
    passport              = require('passport'),
    LocalStrategy         = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    UserSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        nickname: String
    });

UserSchema.plugin(passportLocalMongoose);
model = mongoose.model('Account', UserSchema);

passport.use(new LocalStrategy(model.authenticate()));
passport.serializeUser(model.serializeUser());
passport.deserializeUser(model.deserializeUser());

exports.getModel = model;
exports.getSchema = Schema;
exports.getPassport = passport;