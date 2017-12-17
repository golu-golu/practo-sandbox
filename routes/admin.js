var express = require('express');
var router = express.Router();
var sell = require("../models/sell");

router.get("/", (req, res) => {
    sell.getAllToBeVerified()
        .then(items => {
            finalItems = []
            items.forEach(function(item){
                finalItems.push({"prescription":item["prescription"].substring(7, item["prescription"].length), name: item["name"], price:item["price"]})
            })
            res.render("admin-main",{items:finalItems})
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
            
        })
})


router.post("/verified", (req, res) => {
    sell.afterVerification(req,res)
    .then((msg)=>{
        console.log(msg);
        res.redirect("/admin")
    })
    .catch((err)=>{
        console.log(err)
        res.redirect("/admin")
    })
})



module.exports = router;