var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
import async from 'async';

var User = require('./model.js').User;
var Artical = require('./model.js').Artical;
var WebInfo = require('./model.js').WebInfo;



var AVATAR_UPLOAD_FOLDER = '/avatar/' //图片上传地址


/*
  登录接口
*/
router.get('/admin/login', (req, res, next) => {
	res.render('login.html')

})
router.post('/admin/login', (req, res, next) => {
	let userInfo = req.body;
	User.findOne({
		username: userInfo.username
	}, (err, list) => {
		console.log(111)
		console.log(list)
		if (list) {
			if (list.password && list.password == req.body.password) {
				req.session['loginuser'] = list.toJSON();
				console.log(req.session['loginuser'])
				res.json({
					success: true,
					msg: '密码正确'
				})
			}
		} else {
			res.json({
				success: false,
				msg: '用户名或密码错误'
			})
		}
	})
})


/*
 图片上传接口
*/

router.post('/imageUpload', (req, res, next) => {
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;
	form.keepExtensions = true; //保留后缀

	form.parse(req, (err, fields, files) => {
		if (err) {
			cosnole.log(err)
			return
		}
		console.log(files)
		res.json({
			imgUrl: files.file.path.substring(6)
		})

	})
})


/*
 文章保存接口
*/

router.post('/admin/artical_save', (req, res, next) => {
	console.log(req.session['loginuser'])
	let params = req.body;
	let artical = new Artical({
		title: params.title,
		type: params.type,
		imgUrl: params.imgUrl,
		contentText: params.contentText,
		content: params.content,
		startDate: params.startDate,
		endDate: '',
		eyesTime: ''
	})
	artical.save((err) => {
		if (err) {
			console.log(err)
			res.json({
				success: false,
				err: err,
			})
			return
		}
		res.json({
			success: true,
			msg: '文章发布成功'
		})
	})


})



/*
 文章更新接口
*/

router.post('/admin/artical_update', (req, res, next) => {
	console.log(req.session['loginuser'])
	let params = req.body;
	console.log(params)
	Artical.update({
			_id: params
		}, {
			title: params.title,
			imgUrl: params.imgUrl,
			contentText: params.contentText,
			content: params.content,
			endDate: params.endDate,
			type: params.type
		}, (err, list) => {
			if (err) {
				res.json({
					success: false,
					msg: "更新失败"
				})
				return
			}
			res.json({
				success: true,
				msg: "更新成功"
			})
		})
		/*let artical = new Artical({
			title: params.title,
			type: params.type,
			imgUrl: params.imgUrl,
			contentText: params.contentText,
			content: params.content,
			startDate: params.startDate,
			endDate: '',
			eyesTime: ''
		})
		artical.save((err) => {
			if (err) {
				console.log(err)
				res.json({
					success: false,
					err: err,
				})
				return
			}
			res.json({
				success: true,
				msg: '文章发布成功'
			})
		})*/


})

/*
 文章列表
*/

router.post('/admin/queryTable', (req, res, next) => {
	Artical.find({}).sort({
			startDate: -1
		}).exec((err, list) => {
			if (err) {
				console.log(err)
			}
			res.json({
				list: list
			})
		})
		/*Artical.find({}, (err, list) => {
			res.json({
				list: list
			})
		})*/

})
router.post('/admin/queryTableM', (req, res, next) => {
	let {
		endD,
		startD,
		classify
	} = req.body
	Artical.find({
			startDate: {
				$gte: startD,
				$lte: endD
			}
		}) //.where(type).elemMatch(classify)　
		.sort({
			startDate: -1
		}).exec((err, list) => {

			if (err) {
				console.log(err)
			}
			res.json({
				list: list
			})
		})


})

/*
 文章单个删除
*/


router.post('/admin/deleteArtical', (req, res, next) => {
	let _id = req.body._id;
	Artical.remove({
			_id: {
				$in: _id
			}
		}, (err, list) => {
			if (err) {
				console.log(err)
				res.json({
					success: false,
					msg: '删除失败'

				})
				return
			}
			console.log(list)
			res.json({
				success: true,
				msg: '删除成功'

			})
		})
		/*Artical.find({}, (err, list) => {
			res.json({
				list: list
			})
		})*/

})

/*
	获取home页面数据
*/


router.post('/home/getHomeData', (req, res, next) => {
	let lastId_ = req.body.lastId_;
	let limit = req.body.limit;
	let artical;
	if (req.body.lastId_) {
		artical = Artical.find({
			'_id': {
				"$lt": lastId_
			}
		}).sort({
			startDate: -1
		}).limit(limit).exec((err, list) => {
			if (err) {
				console.log(err)
			}
			res.json({
				list: list
			})
		})
	} else {
		artical = Artical.find({}).sort({
			startDate: -1
		}).limit(5).exec((err, list) => {
			if (err) {
				console.log(err)
			}
			res.json({
				list: list
			})
		})

	}
})


/*
	获取网站信息
*/

router.get('/home/getWebInfo', (req, res, next) => {
	WebInfo.find({}, (err, list) => {
		res.json({
			list: list
		})
	})
})

/*
	设置网站浏览次数
*/
router.get('/home/setVistorCount', (req, res, next) => {
	WebInfo.update({}, {
		$inc: {
			vistorCcount: 1
		}
	}, (err, list) => {
		WebInfo.find({}, (err, list) => {
			res.json({
				success: true,
				vistorCount: list[0].vistorCcount
			})
		})
	})
})

/*
	获取文章详情页
*/

router.post('/home/queryMoreArtical', (req, res, next) => {
	let id = req.body.id
	Artical.findOne({
		_id: id
	}, (err, list) => {
		if (err) {
			console.log(err)
		}
		res.json({
			list
		})
	})
})

/*
  注册接口
*/
router.get('/blog/register', (req, res, next) => {
	res.render('register.html')
})
router.post('/blog/register', (req, res, next) => {
	let userInfo = req.body
	console.log(userInfo)
	User.find({
		username: userInfo.username
	}, (err, list) => {
		console.log(list)
		if (list.length > 0) {
			res.json({
				success: false,
				msg: '用户已经被注册了。'
			})
		} else {
			let user = new User({
				username: userInfo.username,
				password: userInfo.password
			})
			user.save((err) => {
				if (err) {
					console.log(err)
				}
				res.json({
					success: true,
					msg: '注册成功。'
				})
			})
		}
	})
})

/*
  登录接口
*/

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/api/login', (req, res) => {
	res.json({
			success: true
		})
		/*let user = new User({
			username: 'heianqishi',
			password: '123456',

		})
		user.save((err) => {
			if (err) {
				console.log(err)
			}
			console.log('保存成功')
		})
		User.find({
			password: '123456'
		}, function(err, list) {
			console.log(234567890)
			console.log(list)
			res.json({
				list
			})

		})*/
})



router.get('/api/queryMenu', (req, res) => {
	res.json({
		success: true,
		menu: [{
			fMenuId: '011',
			fMenuName: 'Button 按钮',
			fMenuPath: '/componentlist'
		}, {
			fMenuId: '02',
			fMenuName: 'Input 输入框',
			fMenuPath: '/user'
		}, {
			fMenuId: '03',
			fMenuName: ' Other 其他',
			fMenuPath: '/user'
		}, {
			fMenuId: '04',
			fMenuName: 'Text 测试',
			fMenuPath: '/user'
		}]
	})
})
router.get('/api/querySelectData', (req, res) => {
	res.json({
		success: true,
		selectData: [{
			index: '1',
			value: '第一个'
		}, {
			index: '2',
			value: '第二个'
		}, {
			index: '3',
			value: '第三个'
		}, {
			index: '4',
			value: '第四个'
		}, {
			index: '5',
			value: '第五个'
		}]
	})
})



module.exports = router;