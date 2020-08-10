const express = require('express')
const router = express.Router();
const db = require("../db.js");

//These Functions ensure that a session is in place==========
function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/Login");
    } else {
        next();
    }
}

function ensureAdmin(req, res, next) {
    if (!req.session.user || !req.session.user.admin) {
        res.redirect("/Login");
    } else {
        next();
    }
}
//=============================================================

router.get("/Customer", ensureLogin, (req, res) => {
    res.render("dashboard", {
        title: "Dashboard Page",
        user: req.session.user
    });
});


router.get("/DataClerk", ensureAdmin, (req, res) => {
    db.getPackages()
        .then((data) => {
            res.render("dashboard", {
                title: "Clerk Dashboard",
                user: req.session.user,
                packages: data,
            });

        }).catch((err) => {
            console.log(`Error in /DataClerk: ${err}`)
        });

});

router.get("/createPackage", ensureAdmin, (req, res) => {
    console.log("hmm")
    res.render("createPackage", {
        user: req.session.user,
        title: "Create Package",

    })
})

router.post("/createPackage", ensureAdmin, (req, res) => {
    db.validateCreatePackage(req.body).then((data) => {
        db.addPackage(data).then((user) => {
            res.redirect("DataClerk");
        }).catch((err) => {
            console.log("Error in creating package: " + err);
        });
    }).catch((err) => {
        res.render("dashboard/createPackage", {
            title: "Create Package",
            errorMessages: data.errors,
            //information: inputedInfo,
        });
    });
});


router.get("/editPackage", ensureAdmin, (req, res) => {
    if (req.query.id) {
        db.getPackageByID(req.query.id).then((packages) => {
            res.render("editPackage", { package: packages[0] })
        }).catch(() => {
            console.log("Could not find package by name");
            res.redirect("/");
        })
    } else {
        console.log("the else");
        res.redirect("/");
    }
})

router.post("/editPackage", ensureAdmin, (req, res) => {
    console.log("so we posted")
    db.editPackage(req.body).then(() => {
        res.redirect("/Dashboard/DataClerk");
    }).catch((err) => {
        console.log(err);
        res.redirect("/");
    })
})

router.get("/delete", (req, res) => {
    if (req.query.id) {
        db.deletePackageByID(req.query.id); //searching is slow
        res.redirect("/Dashboard/DataClerk"); //typically a faster function
    } else {
        console.log("No Query");
        res.redirect("/Dashboard/DataClerk");
    }
});

router.get("/Logout", function(req, res) {
    req.session.reset();
    res.redirect("/Login");
});

module.exports = router;