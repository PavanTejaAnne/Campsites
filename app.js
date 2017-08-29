var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express()

mongoose.connect("mongodb://localhost/yelp-camp",{useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgroundSchema  = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
        
app.get("/",function(req,res){
    res.render("home");
});

app.get("/campgrounds", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    });

});

app.post("/campgrounds", function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    
    var newCampEntry = {name: name, image: image};
    Campground.create(newCampEntry, function(err, newEntry){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds"); //defaults to get request
        }
    });
    
});

app.get("/campgrounds/new", function(req, res){
    res.render("postpage");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is taking off");
});