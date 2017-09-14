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
app.use(bodyParser.urlencoded({extended: true}));
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

//Home page
        
app.get("/",function(req,res){
    res.render("home");
});

//Show campgrounds
app.get("/campgrounds", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
        }
    });

});

//Add campgrounds

app.post("/campgrounds", function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampEntry = {name: name, image: image, description: desc};
    Campground.create(newCampEntry, function(err, newEntry){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds"); //defaults to get request
        }
    });
    
});

//To create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/postpage");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Comments
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//Auth Routes

app.get('/register', function(req, res) {
   res.render('register'); 
});

app.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
       });
   }); 
});


app.get('/login', function(req, res) {
    res.render('login');
});

//app.post('/route', middleware, callback)
app.post('/login',  passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
});

//logout function
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is taking off");
});

