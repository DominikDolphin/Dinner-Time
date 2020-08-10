const express = require('express');
const router = express.Router();
const MealsDB = require("../model/Meals");
const db = require("../db.js");

router.get("/", (req, res) => {

    db.getFeaturedMeals().then((data) => {
        res.render("home", {
            title: "Home",
            meals: data

        });
    }).catch((err) => {
        console.log("Error loading packages")
    })

});

router.get("/MealPackages", (req, res) => {
    db.getPackages().then((data) => {
        res.render("MealPackages", {
            title: "Meal Packages",
            meals: data

        });
    }).catch((err) => {
        console.log("Error loading packages")
    })

});

module.exports = router;
/*
db.getUsers().then((data) => {
    res.render("users", { students: (data.length != 0) ? data : undefined });
}).catch((err) => {
    res.render("users"); //add an error message or something
});*/