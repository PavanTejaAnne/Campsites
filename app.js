var express = require("express"),
    bodyParser = require("body-parser"),
    User = require("./models/users"),
    mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    seedDB = require("./seeds"),
    Comment = require("./models/comments"),
    passport = require("passport"),
    Local = require("passport-local"),
    app = express()
    
var commentRoute = require("./routes/comments"),
    campRoutes = require("./routes/campgrounds"),
    authRoute = require("./routes/auth");

mongoose.connect("mongodb://localhost/yelp-camp",{useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
seedDB();


app.use(require("express-session")({
    secret:"FrontCamp",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());//For passport
app.use(passport.session());//for passport

//Passport configs
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new Local(User.authenticate));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/",authRoute);
app.use("/campgrounds",campRoutes);
app.use("/campgrounds/:id/comments",commentRoute);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is taking off");
});

