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

router.post("/placeOrder", ensureLogin, (req, res) => {
    var cartData = {
        cart: [],
        total: 0
    };
    cart.getCart().then((items) => {
        cartData.cart = items;
        cart.checkout().then((total) => {
            cartData.total = total;

            //Get all the item/information for email
            let orderItems = "";
            for (let i = 0; i < cartData.cart.length; i++) {
                orderItems += `${cartData.cart[i].packageName} - ${cartData.cart[i].packagePrice}`
                orderItems += `<br>`;
            }

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            const msg = {
                to: "dominik.thibaudeau@gmail.com",
                from: "dominik.thibaudeau@gmail.com",
                subject: 'Dinner Time Order Placed',
                html: `Thank you ${req.session.user.firstName} for placing an order. Your total comes out to ${cartData.total}.<br>
                Your order: <br>
                ${orderItems}`,
            };
            sgMail.send(msg)
                .then(() => {


                    res.redirect("/dashboard/Customer");
                })
                .catch(err => {
                    console.log(`Error ${err}`);
                })
        }).catch((err) => {
            console.log("Error in registration: " + err);
        })
    }).catch((err) => {
        console.log("oopsie: " + err);
        res.redirect("/");
    })
});

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

router.post("/removeItem", (req, res) => { //return the cart to re-render the page
    var cartData = {
        cart: [],
        total: 0
    };
    cart.removeItem(req.body.name).then(cart.checkout)
        .then((inTotal) => {
            cartData.total = inTotal;
            cart.getCart().then((items) => {
                cartData.cart = items;
                res.json({ data: cartData });
            }).catch((err) => { res.json({ error: err }); });
        }).catch((err) => {
            res.json({ error: err });
        })
});

router.get("/cart", ensureLogin, (req, res) => {
    var cartData = {
        cart: [],
        total: 0
    };
    cart.getCart().then((items) => {
            cartData.cart = items;
            cart.checkout().then((total) => {
                cartData.total = total;
                res.render("checkout", { data: cartData, layout: false });
            }).catch((err) => {
                res.send("There was an error getting total: " + err);
            });
        })
        .catch((err) => {
            res.send("There was an error: " + err);
        });
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