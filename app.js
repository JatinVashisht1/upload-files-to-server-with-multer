const express = require("express");
const multer = require("multer");
const path = require("path");

// set storage engine
const storage = multer.diskStorage(
    {
        destination: './public/uploads',
        // function takes three things,
        // request (req)
        // actuale file (file)
        // callback
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)
            );
        }
    }
);

// initialize upload variable
const upload = multer({
    storage: storage,
    // setting filesize limits
    limits: {fileSize: 1000000}
}).single('myImage'); // myImage is the field name 
// you can also upload more than 1 images just use array instead of single

// init app
const app = express();

const port = 3000;

// public folder
app.use(express.static('./public'));

app.get('/', (res, req) => {
    req.send('Home Page')
})

app.post('/upload', (req, res) => {
    upload(req, res, (err) =>{
        if(err){
            res.send("Unable to upload file,")
        }else{
            console.log(req.file)
            res.send("file uploaded")
        }
    });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`))