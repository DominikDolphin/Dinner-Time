const express = require('express');
const router = express.Router();
const db = require("../db.js");
const multer = require("multer");

const inputedInfo = {
    fName: "",
    lName: "",
    mail: "",
    passw: "",
}

const storage = multer.diskStorage({
    destination: "./public/img/",
    filename: function(req, file, cb) {
        // we write the filename as the current date down to the millisecond
        // in a large web service this would possibly cause a problem if two people
        // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
        // this is a simple example.
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    } else {
        return cb(new Error('Not an image! Please upload an image.', 400), false);
    }
};

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage, fileFilter: imageFilter });

router.get("/", (req, res) => {
    res.render("Register", {
        title: "Register",
    });
});

router.post("/sendRegister", (req, res) => {
    db.validateUserRegistration(req.body).then((data) => {
        db.addUser(data).then((user) => {
            inputedInfo.fName = req.body.firstName;
            inputedInfo.lName = req.body.lastName;
            inputedInfo.mail = req.body.email;
            inputedInfo.passw = req.body.password;
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            const msg = {
                to: "dominik.thibaudeau@gmail.com",
                from: "dominik.thibaudeau@gmail.com",
                subject: 'Dinner Time Account Registration',
                html: 'Thank you for registering with Dinner Time. Enjoy amazing food just by the tap of a few buttons!',
            };
            sgMail.send(msg)
                .then(() => {

                    req.session.user = user;
                    res.redirect("/dashboard/Customer");
                })
                .catch(err => {
                    console.log(`Error ${err}`);
                })

        }).catch((err) => {
            console.log("Error in registration: " + err);
        });
    }).catch((data) => {
        console.log("oopsie: " + data);
        res.render("Register", {
            title: "Registration Page",
            errorMessages: data.errors,
            information: inputedInfo,
        });
    });
});

module.exports = router;