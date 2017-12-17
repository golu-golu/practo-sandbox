var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        var dest = 'public/uploads/' + req.user.id;
        var stat = null;
        try {
            stat = fs.statSync(dest);
        } catch (err) {
            fs.mkdirSync(dest);
        }
        if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
        }
        cb(null, dest);
    },
    filename: (req, file, callback) => {
        var today = new Date();
        today = today.getTime();
        var filename = today.toString()+ file.originalname; 
        callback(null, filename);
    }

});

var upload = multer(
    {
        dest: 'public/uploads/',
        storage: storage
    }
);


exports.upload = upload;