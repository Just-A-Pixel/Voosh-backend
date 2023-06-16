const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


const router = express.Router()

const CLIENT_URL = process.env.CLIENT_URL

router.get("/orders", 
passport.authenticate("jwt", {
    // failureRedirect: `/failure`
}),
(req,res) => {
    console.log("hello")
    const sample = [
        {
            id: 1,
            item: "shoe",
            quantity: 2,
            price: 100
        },
        {
            id: 2,
            item: "ball",
            quantity: 3,
            price: 20
        },
        {
            id: 3,
            item: "cap",
            quantity: 3,
            price: 30
        },
        {
            id: 4,
            item: "bat",
            quantity: 3,
            price: 90
        },
        {
            id: 5,
            item: "goggles",
            quantity: 3,
            price: 70
        },
        {
            id: 6,
            item: "band",
            quantity: 3,
            price: 85
        }
    ]
    if(req.isAuthenticated()) res.send({success: true, sample})
    else res.send({
        success: false
    })
})

router.post("/orderList", passport.authenticate("jwt", {
    failureRedirect: CLIENT_URL
}),async (req,res) => {
    
    console.log("HERE ARE THE DETAILS")
    const existingUser = await User.findOneAndUpdate({"email": req.user.email},{items: req.body.items})
    res.status(200).send({success: true})

})

router.get("/userOrders", passport.authenticate("jwt", {
    failureRedirect: CLIENT_URL
}), async (req, res) => {
    const existingUser = await User.findOne({"email": req.user.email})
    res.status(200).send({success: true, existingUser})
})

router.get('/failure', (req,res)=>{
    req.status(400).send({success:false})
})
module.exports = router
