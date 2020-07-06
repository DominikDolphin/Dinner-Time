const express = require('express');
const router = express.Router();

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

    if (req.body.userEmail == "" || req.body.userEmail == undefined) {
        errors.push("You must enter an email");
    }
    if (req.body.password == "" || req.body.password == undefined) {
        errors.push("You must enter a password");
    }

    if (errors.length > 0) {
        res.render("Login", {
            title: "Login",
            errorMessages: errors
        })
    } else {
        //Chahge this to some page
        res.redirect("/");
    }
});

module.exports = router;