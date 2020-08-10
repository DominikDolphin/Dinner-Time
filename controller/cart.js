const express = require('express')
const router = express.Router();
const db = require("../db.js");
const cart = require("../cart.js")
router.get("/", (req, res) => {
    var cartData = {
        cart: [],
        total: 0
    };
    cart.getCart().then((items) => {
            cartData.cart = items;
            cart.checkout().then((total) => {
                cartData.total = total;
                console.log("This is that cartData: ")
                res.render("checkout", { data: cartData.cart[0], layout: false });
            }).catch((err) => {
                res.send("There was an error getting total: " + err);
            });
        })
        .catch((err) => {
            res.send("There was an error: " + err);
        });
});

module.exports = router;