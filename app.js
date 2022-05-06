const express = require("express");
const multer  = require("multer");
const ejs     = require("ejs");
const path    = require("path");

const app     = express();

//set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req,file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//uploads
const upload = multer({
  storage: storage,
  limits: {fileSize: 6000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

function checkFileType(file, cb){
  //allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // check ext
  const extname = filetypes.test(path.extname
    (file.originalname).toLowerCase());
    //check mine
    const mimeType = filetypes.test(file.mimetype);

    if (mimeType && extname) {
      return cb(null, true);
    }else {
      cb("error : img only");
    }
}

app.set("view engine", 'ejs');
app.use(express.static("./public"));

app.get("/", (req,res) => {
  res.render("index");
});

app.post('/upload', (req,res) => {
  upload(req,res, (err) => {
    if (err) {
      res.render("index",  {
        msg: err
      });
    }else {
      console.log(req.file);
      if (req.file == undefined) {
        res.render("index",  {
          msg: "no file selected"
        });
      }else {
        res.render("index", {
          msg: "file uploaded",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});


app.listen(3000, () => {
  console.log("works on 3000...");
});
