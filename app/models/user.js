var mongoose = require('mongoose');
var bcrypt=require('bcryptjs');

//User schema
var UserSchema=new mongoose.Schema({
  email:{
    type:String,
    lowercase:true,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:['Client','Manager','Admin'],
    default:'Client'
  }
});

//Save the user's hashed password
//this will get fire before doc save
UserSchema.pre('save',function(next){
  var user=this;
  if(this.isModified('password') || this.isNew){
    bcrypt.genSalt(10,function(err,salt){
      if(err){
        return(err);
      }
      bcrypt.hash(user.password,salt,function(err,hash){
        if(err){
          return(err);
        }
        user.password=hash;
        next();
      })
    })
  }else{
    return next();
  }
});

//Create method to comapre password
UserSchema.methods.comparePassword=function(pw,cb){
  bcrypt.compare(pw,this.password,function(err,isMatch){
    if(err){
      return cb(err);
    }
    cb(null,isMatch);
  });
}

module.exports=mongoose.model('User',UserSchema);
