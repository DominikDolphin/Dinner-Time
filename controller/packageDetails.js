const express = require('express')
const router = express.Router();
const db = require("../db.js");
const cart = require("../cart.js");
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

//packages?id=1

router.get("/", ensureLogin, (req, res) => {
    if (req.query.id) {
        db.getPackageByID(req.query.id).then((packages) => {
            res.render("packageDetails", {
                title: "Package details",
                data: packages,
                layout: false
            })

        }).catch(() => {
            console.log("There was an error loading package details");
            res.redirect("/MealPackages");
        });
    } else {
        console.log("the else");
        res.redirect("/");
    }
})

router.post("/addProduct", (req, res) => {
    console.log("Adding prod with name: " + req.body.name);
    db.getPackageByName(req.body.name)
        .then((item) => {
            cart.addItem(item)
                .then((numItems) => {
                    res.json({ data: numItems });
                }).catch(() => {
                    res.json({ message: "error adding" });
                })
        }).catch(() => {
            res.json({ message: "No Items found" })
        })
});



module.exports = router;
/*

router.get("/", ensureLogin, (req, res) => {
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
*/