var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment') //自增ID 模块	

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
//autoIncrement.initialize(mongoose.connection);


var userSchema = new Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
	phone: {
		type: String
	},
	email: {
		type: String
	}

})

//网站信息字段
var webInfoSchema = new Schema({
	vistorCcount: {
		type: Number,
		default: 0,
	}

})



var articalSchema = new Schema({
	title: String,
	type: Array,
	imgUrl: String,
	contentText: String,
	content: String,
	startDate: String,
	endDate: String,
	eyesTime: String

})


var User = mongoose.model('bloguser', userSchema);
var Artical = mongoose.model('artical', articalSchema);
var WebInfo = mongoose.model('webInfo', webInfoSchema);
exports.User = User;
exports.Artical = Artical;
exports.WebInfo = WebInfo;