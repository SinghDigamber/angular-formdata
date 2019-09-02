let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  router = express.Router();

// Multer File upload settings
const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


// User model
let User = require('../models/User');


// POST User
router.post('/create-user', upload.single('avatar'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    avatar: url + '/public/' + req.file.filename
  });
  user.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        name: result.name,
        avatar: result.avatar
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})

// GET All Users
router.get("/", (req, res, next) => {
  User.find().then(data => {
    res.status(200).json({
      message: "Users retrieved successfully!",
      users: data
    });
  });
});


module.exports = router;