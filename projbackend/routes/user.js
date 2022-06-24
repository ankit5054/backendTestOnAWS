const express= require("express")
const router = express.Router()

const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserId,getUser,updateUser,getAllUsers,userPurchaseList} = require("../controllers/user")


router.param("userId",getUserId)

router.get("/user/:userId",isSignedIn, isAuthenticated ,getUser )
router.get("/allUsers",getAllUsers)
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser)

router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList)

module.exports = router