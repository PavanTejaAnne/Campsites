var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    seedDB = require("./seeds"),
    Comment = require("./models/comments"),
    app = express()

seedDB();
mongoose.connect("mongodb://localhost/yelp-camp",{useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
        
app.get("/",function(req,res){
    res.render("home");
});

app.get("/campgrounds", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
        }
    });

});

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

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res){
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is taking off");
});

