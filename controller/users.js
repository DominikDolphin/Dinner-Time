const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.get("/", (req, res) => {
    //this code is only for test purposes, just checking function
    if (req.query.email) {
        //console.log("gang")
        db.getUsersByEmail(req.query.email).then((data) => {
            res.render("users", { students: (data.length != 0) ? data : undefined });
        }).catch((err) => {
            res.render("users"); //add an error message or something
        });
    } else {
        //console.log("in da else")
        db.getUsers().then((data) => {
            res.render("users", { students: (data.length != 0) ? data : undefined });
        }).catch((err) => {
            res.render("users"); //add an error message or something
        });
    }
});

module.exports = router;