//start off with the cart empty. 
var userCart = [];

//adds a item from systems to the cart
module.exports.addItem = (inItem) => {
    console.log("Adding cart" + inItem[0].packageName);
    return new Promise((resolve, reject) => {
        userCart.push(inItem[0]);
        resolve(userCart.length);
    });
}

//removes an item from the cart
module.exports.removeItem = (inItem) => {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < userCart.length; i++) {
            if (userCart[i].packageName == inItem) {
                userCart.splice(i, 1);
                i = userCart.length;
            }
        }
        resolve();
    });
}


//returns the cart array and all items
module.exports.getCart = () => {
    return new Promise((resolve, reject) => {
        resolve(userCart);
    });
}


//calculates the price of all items in the cart
module.exports.checkout = () => {
    return new Promise((resolve, reject) => {
        var price = 0; //if check if car is empty
        if (userCart) {
            userCart.forEach(x => {
                price += Number(x.packagePrice);
            });
        }
        resolve(price);
    });
}