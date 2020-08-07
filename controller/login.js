const express = require('express');
const router = express.Router();
const userInfo = { mail: "" };
const db = require("../db.js");

router.get("/", (req, res) => {
    res.render("Login", {
        title: "Log in",
    });
});
/*
router.post("/sendLogin", (req, res) => {
    db.validateUser(req.body)
        .then((inData) => {
            req.session.user = inData[0]; //logs them in as a user

            console.log(req.session.user);
            res.render("users", { students: inData, session: req.session.user });
        })
        .catch((message) => {
            console.log(`So this happened: ${message}`);
            res.redirect("/Login");
        });
});
*/
//Shows the page
router.get("/sendLogin", (req, res) => {
    res.render("Login", {
        title: "Sent Login"
    });
});

//Checks if login has errors
router.post("/sendLogin", (req, res) => {
    const errors = [];

    if (req.body.userEmail == "") {
        errors.push("You must enter an email");
    }
    if (req.body.password == "") {
        errors.push("You must enter a password");
    }

    if (errors.length > 0) {
        res.render("Login", {
            title: "Login",
            errorMessages: errors,
            info: userInfo,
        })
    } else {
        //Chahge this to some page
        //res.redirect("/");

        db.validateUser(req.body)

        .then((inData) => {
                console.log(req.body);
                req.session.user = inData[0]; //logs them in as a user

                console.log(req.session.user);
                res.render("users", { students: inData, session: req.session.user });
            })
            .catch((message) => {
                console.log(req.body);
                console.log(`So this happened: ${message}`);
                res.redirect("/Login");
            });
    }
});

module.exports = router;