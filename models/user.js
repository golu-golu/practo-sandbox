var mongoose = require('mongoose');

var user = mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  passwd: {
    type: String,
    required: true
  },
  items: [],
  wallet: {
    type: Number,
    default: 0
  }
});

var User = mongoose.model("User", user);
exports.User = User;


exports.addUser = (req, res) => {
  return new Promise((resolve, reject) => {
    var phone = req.body.phone;
    var name = req.body.name;
    var passwd = req.body.passwd;
    User.findOne({ phone: phone }, (err, data) => {
      if (err) {
        console.log("AAA");
        reject(err);
      }
      else if (data) {
        console.log("BBB");
        reject("Phone No. already registered");
      }
      else {
        var user = new User({ phone: phone, name: name, passwd: passwd });
        user.save((errr, datas) => {
          if (!errr) {
            console.log("CCC");
            console.log("Successfull Signup");
            resolve({ username: datas.name, phone: datas.phone, id: datas._id });
          }
          else {
            console.log("DDD");
            reject(errr);
          }
        })
      }
    })
  })
}




