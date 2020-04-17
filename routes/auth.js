var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware= require('../middleware');


//Route page 

router.get("/", function(req, res){
    res.render("landing");
});

//======================
// Authentication routes
//=======================
router.get('/register', function(req, res){
	res.render('register');
})

router.post('/register', function(req, res){
		 var newuser=  new User({username: req.body.username});
		User.register(newuser, req.body.password, function(err, user){
			if(err){
				req.flash("error", err.message);
				// console.log(err);
				 return res.render('register');
			}
			passport.authenticate('local')(req,res,function(){
				  req.flash("success", "Welcome to YelpCamp " + user.username);
				res.redirect('/campgrounds');
			})
		})
		 });

router.get('/login', function(req,res){
	
	res.render('login');
})

router.post('/login', passport.authenticate('local',
		{
			successRedirect: '/campgrounds',
			failureRedirect:'/login'
	
		}),
			function(req,res){
	
});

router.get("/logout", function(req, res){
   req.logout();
	req.flash("success", "Logged you out!")
   res.redirect("/campgrounds");
});



module.exports= router;
