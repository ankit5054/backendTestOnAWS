const User = require("../models/user");
const logg = require("../models/logger");
const { validationResult } = require("express-validator");
// const { isEmpty } = require("lodash");
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')



//signup
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT ABLE TO SAVE USER IN DB",
      });
    //   console.log(err);
    }

    // Creating Log and Storing it
    const signInLog = new logg({"_id":user._id,"email":user.email,"action":"Signed Up","token":"Not Required"})
    signInLog.save((err,logRes)=>{
        if(err){
                res.status(400).json({
                err: "NOT ABLE TO SAVE IN LOG DB",
              });
        }
    })

    res.json(user);
  });
};

//signin
exports.signin = (req, res) => {
    const parseIp =  req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress
    console.log(parseIp)
    const {email, password} = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
        error: errors.array()[0].msg,
        param: errors.array()[0].param,
        });
    }
    User.findOne({email},(err,user)=>{

        if(!user){
            return res.status(400).json({
                error:"User Email does not exist!! Please Register."
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email & Password do not match!!"
            })
        }


        // Token creation
        const token = jwt.sign({_id:user._id},process.env.SECRET)
        // token into cockie
        res.cookie("token",token,{expire: new Date + 2})


         // Creating Log and Storing it
        const signInLog = new logg({"id":user._id,"email":user.email,"action":"Signed In","token":token})
        signInLog.save()
        


        // send response to front end
        const {_id, name, email, role} = user
        return res.json({
            user :{id: _id,name: name,email:email,role:role},
            token:token
        })
    })

};


// signout
exports.signout = (req, res) => {
// TODO : insert a logger

    // const {_id} = req.auth
    // User.findOne({_id},(err,user)=>{
    //     // Creating Log and Storing it
    //     const signInLog = new logg({"id":user._id,"email":user.email,"action":"Signed Out","token":"Token Not Required"})
    //     signInLog.save()
    // })


    res.clearCookie("token")
    res.json({
        message:"Signed Out!"
    })
};


// Protected Routes
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty: "auth"
})

// Custom Middlewares
exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id 
    if(!checker){
        res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error:"You are not ADMIN, Access Denied"
        })
    }
    // console.log("Logged In as Admin")
    next();
}


