"use strict";
/*jshint node:true */
exports.saveToDb = function (data, res) {
    return data.save(function (err) {
        if (err) {
            console.log(err);
        }
        return res.send(data);
    });
};
