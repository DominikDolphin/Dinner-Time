const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const PORT = 3000;
const file = require('fs');
const MealsDB = require("./model/Meals");

app.use(express.static("public"));
//Use handlebars template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get("/", (req, res) => {
    res.render("home", {
        title: "Home Page",
        meals: MealsDB.getFeaturedMeals(4)
    });
});

app.get("/MealPackages", (req, res) => {
    //Everything DB related is in model-> Meals.js
    res.render("MealPackages", {
        title: "Meal Packages",
        meals: MealsDB.getAllMeals()

    });
});


//Create express web server
app.listen(PORT, () => {
    console.log("Web server is up and running");
});