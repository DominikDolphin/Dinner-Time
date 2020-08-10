const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    firstName: String,
    lastName: String,
    password: String,
    admin: {
        type: Boolean,
        default: false
    }
    //  international: Boolean
});

let mealPackageSchema = new Schema({
    packageID: {
        type: Number,
        unique: true
    },
    packageName: String,
    packagePrice: Number,
    packageDescription: String,
    packageCategory: String,
    packageNumberOfMeals: Number,
    featured: {
        type: Boolean,
        default: false
    },
    packageImageURL: String
})

//our local student/class template schemas
let Users;
let MealPackage;

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.DATABASE_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

        db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            //create a collection called "students" and "courses"
            //use the above schemas for their layout
            Users = db.model("newusers", userSchema);
            MealPackage = db.model("mealPackages", mealPackageSchema);
            resolve();
        });

    });
}

module.exports.getFeaturedMeals = () => {
    return new Promise((resolve, reject) => {
        MealPackage.find({ top: true })
            .exec()
            .then((packages) => {
                resolve(packages.map((packages) => packages.toObject()));
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports.getPackages = () => {
    return new Promise((resolve, reject) => {
        MealPackage.find()
            .exec()
            .then((package) => {
                resolve(package.map((package) => package.toObject()));
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports.addPackage = function(data) {
    return new Promise((resolve, reject) => {



        for (var formEntry in data) {
            if (data[formEntry] == "")
                data[formEntry] = null;
        }
        var newMeal = new MealPackage(data);
        data.featured = (data.featured) ? true : false;
        newMeal.save((err) => {
            if (err) {
                console.log("There was an error with creating meal: " + err);
                reject(err);
            } else {
                console.log(`Saved meal`);
                resolve();
            }
        })
    });
}

module.exports.addUser = function(data) {
    return new Promise((resolve, reject) => {
        //prep the incoming data 
        console.log("made it here");
        //see if it has been "checked"
        data.international = (data.international) ? true : false;

        for (var formEntry in data) {
            if (data[formEntry] == "") //lets just say this works the way we want
                data[formEntry] = null;
        }
        var newUser = new Users(data); //copy constructor   
        //add hashed password
        bcrypt.genSalt(10) // Generate a "salt" using 10 rounds
            .then(salt => bcrypt.hash(newUser.password, salt)) // use the generated "salt" to encrypt the password: "myPassword123"
            .then(hash => { //returns encrypted password
                // TODO: Store the resulting "hash" value in the DB
                newUser.password = hash;
                //tries to save entry in our database
                newUser.save((err) => {
                    if (err) {
                        console.log("Woopsie there was an error: " + err);
                        reject(err);
                    } else {
                        console.log("Saved that student: " + data.firstName);
                        resolve();
                    }
                });
            })
            .catch(err => {
                console.log(err); // Show any errors that occurred during the process
                reject("Hashing Error");
            });


    });
}

module.exports.getUsers = function(data) {
    return new Promise((resolve, reject) => {
        Users.find()
            .exec() //tells mongoose that we should run this find as a promise.
            .then((returnedUsers) => {
                resolve(filteredMongoose(returnedUsers));
            }).catch((err) => {
                console.log("Error Retriving students:" + err);
                reject(err);
            });
    });
}



module.exports.getUsersByEmail = function(inEmail) {
    return new Promise((resolve, reject) => {
        //email has to be spelled the same as in the data base
        Users.find({ email: inEmail }) //gets all and returns an array. Even if 1 or less entries
            .exec() //tells mongoose that we should run this find as a promise.
            .then((returnedUsers) => {
                if (returnedUsers.length != 0)
                //resolve(filteredMongoose(returnedStudents));
                    resolve(returnedUsers.map(item => item.toObject()));
                else
                    reject("No Students found");
            }).catch((err) => {
                console.log("Error Retriving students:" + err);
                reject(err);
            });
    });
}

const filteredMongoose = (arrayOfMongooseDocuments) => {
    const tempArray = [];
    if (arrayOfMongooseDocuments.length !== 0) {
        arrayOfMongooseDocuments.forEach(doc => {
            var tmp = doc.toObject();
            tmp.id = doc._id.toString();
            tempArray.push(tmp)
        });
    }
    return tempArray;
};

module.exports.validateCreatePackage = (data) => {
    return new Promise((resolve, reject) => {
        data.errors = [];

        //Making sure the clerk doesnt keep any fields empty
        if (data.packageID == "") { data.errors.push("You must enter a package id"); }
        if (data.packageName == "") { data.errors.push("You must enter a package name"); }
        if (data.packagePrice == "") { data.errors.push("You must enter a package price"); }
        if (data.packageDescription == "") { data.errors.push("You must enter a package description"); }
        if (data.packageCategory == "") { data.errors.push("You must enter a package category"); }
        if (data.packageNumberOfMeals == "") { data.errors.push("You must enter the number of meals"); }
        if (data.packageImageURL == "") { data.errors.push("You must enter an image URL"); }

        //Dont forget featured boolean <3

        if (data.errors.length > 0) {
            reject(data);
        } else {
            resolve(data);
        }

    });
}

module.exports.validateUserRegistration = (data) => {
    return new Promise((resolve, reject) => {
        data.errors = [];
        const regex = RegExp("/[a-zA-Z0-9]{6,12}/");
        const name = RegExp("/[a-zA-Z]{3,20}/");
        if (data.firstName == "") {
            data.errors.push("You must enter your first name");
        }
        if (data.firstName.match(name) == false) {
            data.errors.push("First name can only contain letters, from 3 to 20");
        }
        if (data.lastName == "") {
            data.errors.push("You must enter your last name");
        }
        if (data.lastName.match(name) == false) {
            data.errors.push("Last name can only contain letters, from 3 to 20");
        }
        if (data.email == "") {
            data.errors.push("You must enter an email");
        }

        if (data.password == "") {
            data.errors.push("You must enter a password");
        }

        if ((data.password.match(regex)) == false) {
            data.errors.push("Password must be between 6-12 characters");
        }

        if (data.confPass == "") {
            data.errors.push("You must confirm Password");
        }
        if (data.confPass != data.password) {
            data.errors.push("Passwords do not match");
        }

        if (data.errors.length > 0) {
            reject(data);
        } else {
            this.getUsersByEmail(data.email)
                .then((usr) => {
                    data.errors.push("This email is already registered!");
                    reject(data);
                })
                .catch(() => {
                    resolve(data);
                });
        }
    });
}

module.exports.validateUserLogin = (data) => {
    return new Promise((resolve, reject) => {
        data.errors = [];

        if (data.email == "") {
            data.errors.push("Email is required");
        }
        if (data.password == "") {
            data.errors.push("Password is required");
        }
        if (data.email == "" || data.email == "") {
            reject(data);
        }

        this.getUsersByEmail(data.email)
            .then((user) => {
                bcrypt
                    .compare(data.password, user[0].password)
                    .then((res) => {
                        if (res) {
                            resolve(user[0]);
                        } else {
                            data.errors.push("Wrong password or email, please try again");
                            reject(data);
                        }
                    })
                    .catch((err) => {
                        console.log("Cannot compare passwords " + err);
                        reject(data);
                    });
            })
            .catch((err) => {
                console.log("Cannot get by email " + err);
                data.errors.push("Wrong email or password, please try again");
                reject(data);
            });
    });
};


module.exports.editPackage = (editData) => {
    return new Promise((resolve, reject) => {
        editData.featured = (editData.featured) ? true : false;

        //MealPackage.updateOne({ packageName: editData.packageName }, {
        MealPackage.updateOne({ packageID: editData.packageID }, {
                $set: {
                    packageID: editData.packageID,
                    packageName: editData.packageName,
                    packagePrice: editData.packagePrice,
                    packageDescription: editData.packageDescription,
                    packageCategory: editData.packageCategory,
                    packageNumberOfMeals: editData.packageNumberOfMeals,
                    packageImageURL: editData.packageImageURL,
                    featured: editData.featured

                }

            })
            .exec()
            .then(() => {
                console.log(`Package ${ editData.packageName} has been updated`);
                resolve();
            }).catch((err) => {
                reject(err);
            });

    });
}

module.exports.getPackageByName = function(inPackage) {
    return new Promise((resolve, reject) => {
        //email has to be spelled the same as in the data base
        MealPackage.find({ packageName: inPackage }) //gets all and returns an array. Even if 1 or less entries
            .exec() //tells mongoose that we should run this find as a promise.
            .then((returnedPackages) => {
                if (returnedPackages.length != 0)
                //resolve(filteredMongoose(returnedStudents));
                    resolve(returnedPackages.map(item => item.toObject()));
                else
                    reject("No Packages found");
            }).catch((err) => {
                console.log("Error Retriving packages:" + err);
                reject(err);
            });
    });
}
module.exports.getPackageByID = function(inPackage) {
    return new Promise((resolve, reject) => {
        //email has to be spelled the same as in the data base
        MealPackage.find({ packageID: inPackage }) //gets all and returns an array. Even if 1 or less entries
            .exec() //tells mongoose that we should run this find as a promise.
            .then((returnedPackages) => {
                if (returnedPackages.length != 0)
                //resolve(filteredMongoose(returnedStudents));
                    resolve(returnedPackages.map(item => item.toObject()));
                else
                    reject("No Packages found");
            }).catch((err) => {
                console.log("Error Retriving packages:" + err);
                reject(err);
            });
    });
}

module.exports.deletePackageByID = (inID) => {
    //return new Promise((resolve,reject)=>{
    setTimeout(function() {
        MealPackage.deleteOne({ packageID: inID })
            .exec() //run as a promise
            .then(() => {
                //resolve();
            }).catch(() => {
                // reject();  //maybe a problem communicating with server
            });
    }, 2000);


    //});
}