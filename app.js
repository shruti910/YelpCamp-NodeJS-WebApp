var express     	= require("express"),
    app         	= express(),
    bodyParser  	= require("body-parser"),
    mongoose    	= require("mongoose"),
    Campground  	= require("./models/campground"),
	Comment			= require('./models/comment'),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local'),
	User			= require('./models/user'),
    seedDB      	= require("./seed"),
	methodOverride 	= require("method-override"),
	flash			= require("connect-flash")

var campgroundRoutes = require('./routes/campgrounds'),
 	commentRoutes    = require('./routes/comments'),
 	authRoutes		 = require('./routes/auth')

// DB connection
mongoose
.connect("mongodb://localhost/yelp_camp", {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log('DB Connection Error:'+ err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

 //seedDB();
//========================
// PASSPORT CONFIGURATIONS
//==========================

app.use(require("express-session")({
		secret: 'I love coding',
		resave: false,
		saveUninitialized: false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

//middleware

app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Server starting
app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});