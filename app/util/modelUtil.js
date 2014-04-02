"use strict";
/*jshint node:true */

var constructResponse = function (res, err, data) {
    if (err) {
        console.log(err);
        return res.send(err);
    }
    return res.send(data);
};

var saveToDb = function (data, res) {
    return data.save(function (err) {
        return constructResponse(res, err, data);
    });
};

exports.saveToDb          = saveToDb;
exports.constructResponse = constructResponse;
