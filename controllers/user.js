var express=require('express');
var router=express.Router();
var userModel=require.main.require('./models/user-model');

// Request Handler

// router.get('/',function(req,res){
// 	userModel.user(function(result){
// 		if(result && result!=null)
// 			{
// 				console.log({result: result});
// 				res.render('./emp/index',{result: result});
// 			}
// 		else
// 			{
// 				res.redirect('/error/regError');
// 			}
// 	});

// });

//Exports

router.get('/useredit/:username?',function(req,res){
	var data={
		username: req.params.username
	};
	userModel.useredit(data,function(result){
		res.render('./user/editprofile',{result:result});
	});
});
router.post('/useredit/:username?',function(req,res){
	var data={
		username: req.params.username,
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		phone: req.body.phone,
		address: req.body.address
	};
	userModel.userprofileupdate(data,function(valid){
		if(valid)
			{
				res.render('./user/userprofile/');
			}
		else
			{
				res.render('/error/error');
			}
	});
});
module.exports=router;
