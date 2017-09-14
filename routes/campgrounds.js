var express =  require("express"),
    router = express.Router(),
    Campground = require("../models/campgrounds")


//Show campgrounds
router.get("/", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
        }
    });

});

//Add campgrounds

router.post("/", function(req,res){
    
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
router.get("/new", function(req, res){
    res.render("campgrounds/postpage");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;