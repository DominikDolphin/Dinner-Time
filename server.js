const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

//Use handlebars template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//load controllers
const genController = require("./controller/general");
const registrationController = require("./controller/registration");
const loginController = require("./controller/login");


//map each controller to the app object
app.use("/", genController);
app.use("/Login", loginController);
app.use("/Register", registrationController);

//Create express web server
app.listen(PORT, () => {
    console.log("Web server is up and running");
});