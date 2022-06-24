const User = require("../models/user")
const Order= require("../models/order")
const { ResultWithContext } = require("express-validator/src/chain")


exports.getUserId = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User Not Found!!"
            })
        }
        const {name,lastname,_id,email, role} = user
        req.profile = {name:name,lastname:lastname,_id:_id,email:email,role:role}
        next()
    })

    
}

exports.getUser = (req,res)=>{
    return res.json(req.profile)
}

exports.getAllUsers = (req,res)=>{
    User.find().exec((err,users)=>{
        if(err || !users){
            return res.status(400).json({
                error:"No User Found!"
            })
        }
        return res.status(200).json(users)
    })
}

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err || !user){
                return res.status(400).json({
                    error:"Unauthorised !! "
                })
            }
            // User.
            if (req.body.password)
            {
                user.updatePswd(req.body.password) 
                const {encry_password} = user
                User.findByIdAndUpdate(
                    {_id:req.profile._id},
                    {$set:{encry_password:encry_password}},
                    {new:true,useFindAndModify:false},
                    (err,user)=>{
                        if(err || !user){
                            return res.status(400).json({
                                error:"Unauthorised !! "
                            })
                        }
                    }
                )
            }
            const {name,lastname,_id,email} = user
            return res.status(200).json({name:name,lastname:lastname,_id:_id,email:email})
        }       
    )
}

exports.userPurchaseList = (req,res)=>{
     Order.find({user:req.profile._id})
     .populate("user","_id name")
     .exec((err,order=>{
         if(err){
             return res.status(400).json({
                 error:"No Order for the User"
             })
         }
         return res.json(order)
     }))
}

exports.pushOrderInOurchaseList = (req,res,next)=>{
    let purchases = [] 
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id : product._id,
            name: product.name,
            description: product.description,
            category : product.category,
            quantity:product.quantity,
            amount: req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    })

    // Storing in DB
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push: {purchases: purchases}},
        {new:true},
        (err, purchasesList)=>{
            if(err || !purchasesList){
                return res.status(400).json({
                    error:"Failed Store the Purchase list into DB!! Please try again." 
                })
            }
        next()
        // return res.status(200).json(purchasesList)
        }
    )



}