const express = require('express');
const router = express.Router();
const db = require("../db.js");

/*
router.get("/", (req, res) => {
    res.render("users", {
        title: "Users",
    });
});*/
/*
router.get("/", (req, res) => {

    db.getStudents().then((data) => {
        res.render("users", { students: data });
    }).catch((err) => {
        res.render("users", { students: err });
    });
});
*/

router.get("/", (req, res) => {
    //this code is only for test purposes, just checking function
    if (req.query.email) {
        console.log("gang")
        db.getStudentsByEmail(req.query.email).then((data) => {
            res.render("users", { students: (data.length != 0) ? data : undefined });
        }).catch((err) => {
            res.render("users"); //add an error message or something
        });
    } else {
        console.log("in da else")
        db.getStudents().then((data) => {
            res.render("users", { students: (data.length != 0) ? data : undefined });
        }).catch((err) => {
            res.render("users"); //add an error message or something
        });
    }
});

module.exports = router;