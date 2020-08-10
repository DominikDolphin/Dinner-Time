const express = require('express');
const router = express.Router();
const userInfo = { mail: "" };
const db = require("../db.js");
const server = require("../server.js")

router.get("/", (req, res) => {
    res.render("Login", {
        title: "Log in",
    });
});

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
        let userInfo = {};
        userInfo.email = req.body.email;
        userInfo.password = req.body.password;
        db.validateUserLogin(req.body)
            .then((inData) => {
                console.log(req.body);
                req.session.user = inData; //logs them in as a user
                if (inData.admin) {
                    res.redirect("/dashboard/DataClerk");
                    console.log("Session user is an admin")
                } else {
                    res.redirect("/dashboard/Customer");
                    console.log("Session user is a customer")
                }
            })
            .catch((message) => {
                console.log(req.body);
                console.log(`So this happened: ${message}`);
                res.redirect("/Login");
            });
    }
});

module.exports = router;