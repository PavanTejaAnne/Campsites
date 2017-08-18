var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds = [
        {name:"Salmon Creek", image:"http://www.photosforclass.com/download/14435096036"},
        {name:"Raddison Creek", image:"http://www.photosforclass.com/download/3694344957"},
        {name:"Wonder Creek", image:"https://www.pinterest.com/pin/179158891400024191/"},
        {name:"Salmon Creek", image:"http://www.photosforclass.com/download/14435096036"},
        {name:"Raddison Creek", image:"http://www.photosforclass.com/download/3694344957"},
        {name:"Wonder Creek", image:"https://www.pinterest.com/pin/179158891400024191/"},
        {name:"Salmon Creek", image:"http://www.photosforclass.com/download/14435096036"},
        {name:"Raddison Creek", image:"http://www.photosforclass.com/download/3694344957"},
        {name:"Wonder Creek", image:"https://www.pinterest.com/pin/179158891400024191/"},
        ];
        
app.get("/",function(req,res){
    res.render("home");
});

app.get("/campgrounds", function(req,res){
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    
    var newEntry = {name: name, image: image};
    campgrounds.push(newEntry);
    res.redirect("/campgrounds"); //defaults to get request
    
});

app.get("/campgrounds/new", function(req, res){
    res.render("postpage");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is taking off");
});