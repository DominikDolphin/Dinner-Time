const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;
/*
let studentSchema = new Schema({
    studentNumber: {
        type: Number,
        unique: true
    },
    name: String,
    email: String,
    international: Boolean
});
*/
let studentSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    firstName: String,
    lastName: String,
    password: String
        //  international: Boolean
});

let classSchema = new Schema({
    courseCode: String,
    section: String,
    year: String,
    numberOfStudents: Number
});

//our local student/class template schemas
let Students;

let Classes;

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.DATABASE_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

        db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            //create a collection called "students" and "courses"
            //use the above schemas for their layout
            Students = db.model("newusers", studentSchema);
            Classes = db.model("courses", classSchema);
            resolve();
        });

    });
}

/*
module.exports.addStudent = function(data) {
    return new Promise((resolve, reject) => {
        //prep the incoming data 

        //see if it has been "checked"
        //data.international = (data.international) ? true : false;

        //set data to null if an empty string ""
        for (var formEntry in data) {
            if (data[formEntry] == "")
                data[formEntry] = null;
        }

        //add data
        var newStudent = new Students(data);

        newStudent.save((err) => {
            if (err) {
                console.log("Woopsie there was an error: " + err);
                reject();
            } else {
                console.log("Saved that student: " + data.firstName);
                resolve();
            }
        });
    });
}
*/
module.exports.addStudent = function(data) {
    return new Promise((resolve, reject) => {
        //prep the incoming data 

        //see if it has been "checked"
        data.international = (data.international) ? true : false;

        //set data to null if an empty string ""


        //for-in loops the variable that we loop with is a copy. 
        for (var formEntry in data) {
            if (data[formEntry] == "") //lets just say this works the way we want
                data[formEntry] = null;
        }

        //add data to based off local Student Collection
        //local only so data is not pushed to mongo
        //NOTE: only works if the field names are the same. "Name" vs "name" doesn't work. 
        var newStudent = new Students(data); //copy constructor   
        //add hashed password
        bcrypt.genSalt(10) // Generate a "salt" using 10 rounds
            .then(salt => bcrypt.hash(newStudent.password, salt)) // use the generated "salt" to encrypt the password: "myPassword123"
            .then(hash => { //returns encrypted password
                // TODO: Store the resulting "hash" value in the DB
                newStudent.password = hash;
                //tries to save entry in our database
                newStudent.save((err) => {
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





module.exports.getStudents = function(data) {
    return new Promise((resolve, reject) => {
        Students.find()
            .exec() //tells mongoose that we should run this find as a promise.
            .then((returnedStudents) => {
                resolve(filteredMongoose(returnedStudents));
            }).catch((err) => {
                console.log("Error Retriving students:" + err);
                reject(err);
            });
    });
}

module.exports.getAllCarsP = () => {
    return new Promise((resolve, reject) => {
        if (Students.length == 0) {
            reject("There are no cars available");
            return;
        } else {
            setTimeout(() => {
                resolve(Students);
                return;
            }, 1000);
        }
    });
}

module.exports.getStudentsByEmail = function(inEmail) {
    return new Promise((resolve, reject) => {
        //email has to be spelled the same as in the data base
        Students.find({ email: inEmail }) //gets all and returns an array. Even if 1 or less entries
            .exec() //tells mongoose that we should run this find as a promise.
            .then((returnedStudents) => {
                if (returnedStudents.length != 0)
                //resolve(filteredMongoose(returnedStudents));
                    resolve(returnedStudents.map(item => item.toObject()));
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