var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
   username: {type: String, required: true, index: {unique: true}},
   password: {type: String, required: true}
});

var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1
};

UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
       if(err) return next(err);
       bcrypt.hash(user.password, salt, function(err, hash){
           if(err) return next(err);
           user.password = hash;
           next();
       });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.statics.getAuthenticated = function(username, password, cb){
    this.findOne({username: username}, function(err, user){
        if(err) return cb(err);
        if(!user){
            return cb(null, null, reasons.NOT_FOUND);
        }
        user.comparePassword(password, function(err, isMatch){
            if(err) return cb(err);
        });
    });
};

module.exports = mongoose.model("User", UserSchema);