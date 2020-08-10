const express = require('express');
const router = express.Router();
const MealsDB = require("../model/Meals");
const db = require("../db.js");

router.get("/", (req, res) => {
    res.render("home", {
        title: "Home Page",
        meals: MealsDB.getFeaturedMeals(4)
    });
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