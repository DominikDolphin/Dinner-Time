const express = require('express');
const router = express.Router();
const MealsDB = require("../model/Meals");

router.get("/", (req, res) => {
    res.render("home", {
        title: "Home Page",
        meals: MealsDB.getFeaturedMeals(4)
    });
});

router.get("/MealPackages", (req, res) => {
    //Everything DB related is in model-> Meals.js
    res.render("MealPackages", {
        title: "Meal Packages",
        meals: MealsDB.getAllMeals()

    });
});

module.exports = router;