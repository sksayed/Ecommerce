var express=require('express');
var asyncValidator=require('async-validator');
var router=express.Router();
checkoutModel=require.main.require('./models/checkout-model');
 const user=require.main.require('./models/user-model');
 const cartModel = require.main.require('./models/cart-model');
 var cart=require.main.require('./models/cart-model');


// Request Handler

router.all('/',function(req,res){

	if(req.session.cart.length==0)
	{
		res.redirect('/index');
	}

	else
	{
		if(req.session.loggedUser!=null)
		{
			var data={
				username: req.session.loggedUser
			};
			user.user(data,function(result){
				if(result!=null && result)
				{
					var allresult={
						cart: req.session.cart,
						user: result
					};
					res.render('./checkout/checkout',{result: allresult});
				}				
			});
}
		else
		{
			res.redirect('/login');
		}	
	}
	
});



router.get('/placeorder',function(req,res){
	res.render('./error/error');
});

router.post('/placeorder',function(req,res){


	if(req.session.cart.length==0)
	{
		res.redirect('/index');
	}

	else //jodi cart e jinis thake 
	{


		if(req.session.loggedUser!=null) //jodi valid user hoi
		{
			console.log( "ekhane asche ");
			
				var info={
					username: req.session.loggedUser

				}
				var sessioncart=req.session.cart;
				var productcart={sessioncart};
				user.user(info,function(userid){
					for(var i=0;i<req.session.cart.length;i++)
					{
						var data={
							productid: productcart.sessioncart[i].id,
							productname: productcart.sessioncart[i].productname,
							userid: userid[0].id,
							username: userid[0].username,
							quantity: productcart.sessioncart[i].quantity,
							price: productcart.sessioncart[i].price*productcart.sessioncart[i].quantity,
							phonenumber: userid[0].phone,
							address: userid[0].address,
							zipcode: '1122'
						};
						console.log(data);
						checkoutModel.placeorder(data,function(valid){
							
							console.log(data.quantity);
							if(valid)
							{
								var data1={
									quantityorder: data.quantity,
									productid: data.productid
								};
								checkoutModel.updatequantity(data1,function(valid1){
									if(valid1){
										req.session.cart=[];
										res.render('./checkout/thanks');
									}
									else
									{
										res.redirect('/index');
									}
								});	
							}
							else
							{
								res.redirect('/cart');
							}
						});	
					}
				});
}
		else
		{
			res.redirect('/login');
		}	
	}
	
});

router.post('/payment' , function( req , res )
{
	console.log(" payment method er moddhe asche ");
	if(req.session.cart.length==0)
	{
		res.redirect('/index');
	}
	else
	{
		
		if(req.session.loggedUser!=null)
		{
			var sessioncart=req.session.cart;
			//console.log( sessioncart);
			var productcart={sessioncart};
			
			
			for(var i=0;i<req.session.cart.length;i++)
			{
				var data = {
					quantity: productcart.sessioncart[i].quantity,
					productid: productcart.sessioncart[i].id
					

				};
                
				console.log(data);
				checkoutModel.updatequantity(data,function(valid1){
					console.log(" update korte gese ");
				 if(valid1){
					
				 }
				 else
				 {
					 res.redirect('/index');
				 }
			 });	

				/*cart.addtocart(data.productid,function(result){
					
					if(result && result!=null)
					{
					   var quan = result[0].quantity - data.quantity ;
					   data.quantity = quan ;
					   console.log(data.quantity);
					   checkoutModel.updatequantity(data,function(valid1){
						   console.log(" update korte gese ");
						if(valid1){
							req.session.cart=[];
							res.render('./checkout/thanks');
						}
						else
						{
							res.redirect('/index');
						}
					});	

					}
					else 
					{
						res.render('./error/error');

					}

				
				
				
				});*/

				

			}
			req.session.cart=[];
			res.render('./checkout/thanks');

		}
		else
		{
			res.redirect('/login');
		}

	}

})


//Exports

module.exports=router;

