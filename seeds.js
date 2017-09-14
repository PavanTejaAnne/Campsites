var mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comments")

var data =[
    {
        name: "Mountain 1",
        image: "http://www.photosforclass.com/download/5062575465",
        description:"Random stuff about M1"
    },
    {
        name: "Mountain 2",
        image: "http://www.photosforclass.com/download/7847253398",
        description:"Random stuff about M2"
    },
    {
        name: "Mountain 3",
        image: "http://www.photosforclass.com/download/14940154247",
        description:"Random stuff about M3"
    }
]

//Remove and add campgrounds    
function seedDB(){
    //Remove all campgrounds  
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed entry!!")
        //add some campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, data){
            if(err){
                console.log(err);
            }else{
                console.log("added a mountain");
                
                Comment.create({
                    text: "This is a sample comment",
                    author: "Bhaskar"
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    }else{
                        data.comments.push(comment);
                        data.save();
                        console.log("Added a new comment");
                    }
                });
            }
        });
    });
}); 
    
}

module.exports = seedDB;