const express = require("express");
const { readFile } = require("fs");
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

function checkFileType(file, cb) {
    // allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime type
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb('Error: Images Only');
    }
}

// initialize upload variable
const upload = multer({
    storage: storage,
    // setting filesize limits
    limits: {
        fileSize: 1000000,
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
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
    upload(req, res, (err) => {
        if (err) {
            res.send("Unable to upload file, " + err)
        } else {
            if (req.file == undefined) {
                res.send("Select a file mf :)")
            } else {
                console.log(req.file)
                res.send("file uploaded")
            }
        }
    });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`))