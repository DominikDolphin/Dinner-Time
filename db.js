const mongoose = require("mongoose");

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
        let db = mongoose.createConnection("mongodb+srv://admin:asdasd@cluster0.kpvqi.mongodb.net/Web322DinnerTime?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

        db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            //create a collection called "students" and "courses"
            //use the above schemas for their layout
            Students = db.model("newUsers", studentSchema);
            Classes = db.model("courses", classSchema);
            resolve();
        });

    });
}


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