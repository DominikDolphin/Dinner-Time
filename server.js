const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const db = require("./db.js");
const clientSessions = require("client-sessions");


//Connection to database
//let db = mongoose.createConnection("mongodb+srv://admin:asdasd@cluster0.kpvqi.mongodb.net/Web322DinnerTime?retryWrites=true&w=majority")

//load environment varibale file
require('dotenv').config({ path: "./config/keys.env" });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/Login");
    } else {
        next();
    }
}

//Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    //secret: process.env.CLIENT_SESSION_STRING, // this should be a long un-guessable string.
    secret: "AHaha_Doms)t3h_bastttte",
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/Login");
});


//app.use(bodyParser.urlencoded({ extended: false }));

//Use handlebars template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//load controllers
const genController = require("./controller/general");
const registrationController = require("./controller/registration");
const loginController = require("./controller/login");
const usersController = require("./controller/users");
const dashboardController = require("./controller/dashboard");

db.initialize()
    .then(() => {
        console.log("Data read successfully");
        app.listen(PORT, () => {
            console.log("Web server is up and running on Port: " + PORT);
        });
    })
    .catch((data) => {
        console.log(data);
    })

//map each controller to the app object
app.use("/", genController);
app.use("/Login", loginController);
app.use("/Register", registrationController);
app.use("/users", usersController);
app.use("/Dashboard", dashboardController);