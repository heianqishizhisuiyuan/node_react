"use strict";




var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //为了解决过期问题
mongoose.set('debug', true);

mongoose.connect('mongodb://localhost:27017/BlogReact', {
	useMongoClient: true
});

var db = mongoose.connection
db.on("error", function(error) {
	console.log("connection error:" + error);
})
db.on("openUri", function() {
	console.log("connection success");
})

exports.db = db;
