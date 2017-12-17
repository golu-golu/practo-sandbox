var mongoose = require('mongoose');
var user = require("./user")

var sell = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    expiryDate:{
        type: String
    },
    quantity: {
        type: Number,
        required: true
    },
    expired: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    used: {
        type: String
    },
    free: {
        type: String
    },
    verified: {
        type: String,
        default: "no"
    },
    pAval: {
        type: String
    }
    ,
    prescription: {
        type: String
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    mandate:{
        type: String
    }
});




var Sell = mongoose.model("Sell", sell);
exports.Sell = Sell;


exports.addItem = (req, res) => {
    return new Promise((resolve, reject) => {
        var userId =  req.user.id
        var quantity = req.body.quantity;
        var expired = req.body.expired;
        var used = req.body.used;

        var name = req.body.name;
        var pAval = req.body.pAval;
        var free = req.body.free;
        var price = req.body.price;
        var expiryDate = req.body.expdate;
        if (pAval == "yes") {
            prescription = req.file.path;
        }
        else {
            free = "yes";
            prescription = "NA";
        }
        if (free != "yes") {
            free = "no"
        }
        var date = new Date()
        
        yearStart = parseInt(req.body.mandate.split("/")[2])
        monthStart = parseInt(req.body.mandate.split("/")[1])
        var text = expiryDate
        yearEnd = parseInt(text.split("/")[2])
        monthEnd = parseInt(text.split("/")[1])
        var yearMiddle=(date.getFullYear())
        var monthMiddle=(date.getMonth()+1)

        var diff=(yearEnd-yearStart)*12+(monthEnd-monthStart)
        var k=(yearEnd-yearMiddle)*12+(monthEnd-monthMiddle)
        console.log(yearStart,monthStart,yearEnd, monthEnd, yearMiddle, monthMiddle);
        var n=(parseFloat(k)/diff)
        var final_price=n*diff*quantity
        var ins = { userId: userId, quantity: quantity, expired: expired, used: used, free: free, name: name, pAval: pAval, prescription: prescription, price:final_price, expiryDate:expiryDate, mandate:req.body.mandate }
        var sell = new Sell(ins);
        sell.save((err, item) => {
            if (!err && item) {
                user.User.findById(userId, (erru, userData) => {
                    if (erru || !userData) {
                        console.log("B");
                        reject(err)
                    }
                    else {
                        var items = userData.items;
                        items.push(item._id);
                        user.User.findByIdAndUpdate(userId, { $set: { items: items } }, { new: true }, (erri, updated) => {
                            if (!erri && updated) {
                                console.log("C");
                                resolve("Total price: "+final_price);
                            }
                            else {
                                console.log("D");
                                reject(erri)
                            }
                        })
                    }
                })
            }
            else {
                console.log("A");
                reject(err);
            }
        })
    })
}



exports.getAllToBeVerified = () => {
    return new Promise((resolve, reject) => {
        Sell.find({ verified: "no", free: "no" }, (err, items) => {

            if (err) {
                reject(err)
            }
            else if (!items || items.length == 0) {
                reject("No items to sell")
            }
            else {

                resolve(items)
            }
        })
    })
}



exports.afterVerification = (req, res) => {
    return new Promise((resolve, reject) => {
        Sell.findOneAndUpdate({ prescription: "public/"+req.body.prescription }, { $set: { verified: "yes",  location: req.body.location } }, { new: true }, (err, verified) => {
            if (err || !verified) {
                reject(err)
            }
            else {
                resolve("Verified");
            }
        })
    })
}


exports.toBeSubmitted = (req, res) => {
    return new Promise((resolve, reject) => {
        var userId = req.user.id
        Sell.find({ userId: userId, verified: "yes", free:"yes" }, (err, data) => {
            if (err || !data){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}





