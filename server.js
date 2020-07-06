const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const PORT = 3000;
const file = require('fs');
const MealsDB = require("./model/Meals");
const bodyParser = require('body-parser');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
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

//Shows the page
app.get("/sendLogin", (req, res) => {
    res.render("Login", {
        title: "Sent Login"
    });
});

//Checks if login has errors
app.post("/sendLogin", (req, res) => {
    const errors = [];

    if (req.body.userEmail == "" || req.body.userEmail == undefined) {
        errors.push("You must enter an email");
    }
    if (req.body.password == "") {
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
    console.log(`Username: ${req.body.userEmail}`);
    console.log(`Password: ${req.body.password}`);
});

app.get("/sendRegister", (req, res) => {
    res.render("Register", {
        title: "Register"
    });
});

app.post("/sendRegister", (req, res) => {
    const errors = [];

    //Only letters and numbers, length 6-12
    const regex = RegExp("/[a-zA-Z0-9]{6,12}/");
    if (req.body.userEmail == "") {
        errors.push("You must enter an email");
    }
    if ((req.body.passw.match(regex)) == false) {
        errors.push("Password must be between 6-12 characters");
    }
    if (req.body.passw == "") {
        errors.push("You must enter a password");
    }
    if (req.body.confPassw == "") {
        errors.push("You must enter a password");
    }
    if (req.body.confPassw != req.body.passw) {
        errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
        res.render("Register", {
            title: "Register",
            errorMessages: errors
        })
    } else {
        //Chahge this to some page
        res.redirect("/");
    }
    console.log(`Email: ${req.body.userEmail}`);
    console.log(`Password: ${req.body.password}`);
});
//Create express web server
app.listen(PORT, () => {
    console.log("Web server is up and running");
});