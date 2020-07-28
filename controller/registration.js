const express = require('express');
const router = express.Router();
const db = require("../db.js");
const inputedInfo = {
    fName: "",
    lName: "",
    mail: "",
    passw: "",
}
router.get("/", (req, res) => {
    res.render("Register", {
        title: "Register",
    });
});

router.get("/sendRegister", (req, res) => {
    res.render("Register", {
        title: "Register"
    });
});

router.post("/sendRegister", (req, res) => {

    const errors = [];
    //Only letters and numbers, length 6-12
    const regex = RegExp("/[a-zA-Z0-9]{6,12}/");
    const name = RegExp("/[a-zA-Z]{3,20}/");

    if (req.body.firstName == "") {
        errors.push("You must enter your first name");
    }
    if (req.body.firstName.match(name) == false) {
        errors.push("First name can only contain letters, from 3 to 20");
    }
    if (req.body.lastName == "") {
        errors.push("You must enter your last name");
    }
    if (req.body.lastName.match(name) == false) {
        errors.push("Last name can only contain letters, from 3 to 20");
    }
    if (req.body.email == "") {
        errors.push("You must enter an email");
    }

    if (req.body.password == "") {
        errors.push("You must enter a password");
    }

    if ((req.body.password.match(regex)) == false) {
        errors.push("Password must be between 6-12 characters");
    }

    if (req.body.confPass == "") {
        errors.push("You must confirm Password");
    }
    if (req.body.confPass != req.body.password) {
        errors.push("Passwords do not match");
    }
    inputedInfo.fName = req.body.firstName;
    inputedInfo.lName = req.body.lastName;
    inputedInfo.mail = req.body.userEmail;
    inputedInfo.passw = req.body.passw;

    if (errors.length > 0) {

        res.render("Register", {
            title: "Register",
            errorMessages: errors,
            info: inputedInfo,
        })
    } else {
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
                res.redirect("/");
            })
            .catch(err => {
                console.log(`Error ${err}`);
            })

        db.addStudent(req.body).then(() => {
            res.redirect("/");
        }).catch((err) => {
            console.log("Error adding student: " + err);
            res.redirect("/");
        })
    }
});

module.exports = router;