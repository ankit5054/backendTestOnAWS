const express = require("express");
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

// routes

// signup
router.post(
  "/signup",
  [
    check("name","Name must be at least of 3 Characters").isLength(3).withMessage("Name must be at least of 3 Characters"),
    check("password").isLength({min:5,max:10}).withMessage("Password length should be min 5, max 10 char long"),
    check("email","Enter a valid email ID").isEmail().withMessage("Enter a valid email ID"),
  ],
  signup
);


// signin
router.post(
  "/signin",
  [
    check("password").isLength({min:5,max:10}).withMessage("Password required"),
    check("email","Enter a valid email ID").isEmail(),
  ],
  signin
);


// signout
router.get("/signout" ,signout);


router.get("/testroute", isSignedIn,(req,res)=>{
  // res.json(req.auth)
  res.send(req.auth)
});



module.exports = router;
