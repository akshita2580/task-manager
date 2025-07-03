const mongoose = require('mongoose');

const mongoDBconnection = async () => {
    mongoose.connect('mongodb://localhost:27017/taskManager', {
        useNewUrlParser: true, useUnifiedTopology: true,
    }).then(() => {
        console.log("MongoDB connected successfully");
    }).catch((err) => {
        console.error("MongoDB connection error:", err);
    });
}
module.exports = mongoDBconnection;
