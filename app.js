var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express()

mongoose.connect("mongodb://localhost/yelp-camp",{useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgroundSchema  = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "GTA 5",
//     image: "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwjv_ufi447WAhUmrFQKHVIQCRwQjRwIBw&url=https%3A%2F%2Fwww.geforce.com%2Fwhats-new%2Fguides%2Fgrand-theft-auto-v-pc-graphics-and-performance-guide&psig=AFQjCNHPZ5_g8PXy4jqndxriePgNEw_3nA&ust=1504726115737426",
//     description: "High resolution pics of GTA5"
    
//     },
//     function(err, campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(campground);
//         }
//     });
        
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
    res.render("postpage");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is taking off");
});