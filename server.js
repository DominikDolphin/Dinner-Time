const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const db = require("./db.js");
//const mongoose = require("mongoose");

//Connection to database
//let db = mongoose.createConnection("mongodb+srv://admin:asdasd@cluster0.kpvqi.mongodb.net/Web322DinnerTime?retryWrites=true&w=majority")

//load environment varibale file
require('dotenv').config({ path: "./config/keys.env" });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//app.use(bodyParser.urlencoded({ extended: false }));

//Use handlebars template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//load controllers
const genController = require("./controller/general");
const registrationController = require("./controller/registration");
const loginController = require("./controller/login");


db.initialize()
    .then(() => {
        console.log("Data read successfully");
        app.listen(PORT, () => {
            console.log("Web server is up and running");
        });
    })
    .catch((data) => {
        console.log(data);
    })

//map each controller to the app object
app.use("/", genController);
app.use("/Login", loginController);
app.use("/Register", registrationController);

//Create express web server
/*app.listen(PORT, () => {
    console.log("Web server is up and running");
});*/