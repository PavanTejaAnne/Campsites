var mongoose = require("mongoose");
var LocalMongo = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    passport: String
});

UserSchema.plugin(LocalMongo);

module.exports = mongoose.model("User", UserSchema);