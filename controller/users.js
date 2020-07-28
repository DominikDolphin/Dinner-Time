const express = require('express');
const router = express.Router();
const db = require("../db.js");

/*
router.get("/", (req, res) => {
    res.render("users", {
        title: "Users",
    });
});*/

router.get("/", (req, res) => {

    db.getStudents().then((data) => {
        res.render("users", { students: data });
    }).catch((err) => {
        res.render("users", { students: err });
    });
});

module.exports = router;