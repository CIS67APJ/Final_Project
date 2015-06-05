var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var UserSchema = new Schema({
   username: String,
   password: String,
   domain: String,
   uid: String
});

module.exports = mongoose.model("User", UserSchema);