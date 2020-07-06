const express = require('express');
const router = express.Router();

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

    if (req.body.userEmail == "" || req.body.userEmail == undefined) {
        errors.push("You must enter an email");
    }

    if (req.body.passw == "" || req.body.passw == undefined) {
        errors.push("You must enter a password");
    }

    if ((req.body.passw.match(regex)) == false) {
        errors.push("Password must be between 6-12 characters");
    }

    if (req.body.confPass == "" || req.body.confPass == undefined) {
        errors.push("You must confirm Password");
    }
    if (req.body.confPass != req.body.passw) {
        errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
        res.render("Register", {
            title: "Register",
            errorMessages: errors
        })
    } else {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
            to: `${req.body.userEmail}`,
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
    }
});

module.exports = router;