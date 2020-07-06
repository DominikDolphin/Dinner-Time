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

app.get("/Login", (req, res) => {
    //Everything DB related is in model-> Meals.js
    res.render("Login", {
        title: "Log in",
    });
});

app.get("/Register", (req, res) => {
    res.render("Register", {
        title: "Register",
    });
});

app.post("/sendLogin", (req, res) => {
    const errors = [];

    if (req.body.email == "") {
        errors.push("You must enter an email");
    }
    if (req.body.password == "") {
        errors.push("You must enter a password");
    }

    if (errors.length > 0) {
        res.render("", {
            title: "Sms Page",
            errorMessages: errors
        })
    }
    console.log(`Username: ${req.body.username}`);
    console.log(`Password: ${req.body.password}`);
});

//Create express web server
app.listen(PORT, () => {
    console.log("Web server is up and running");
});