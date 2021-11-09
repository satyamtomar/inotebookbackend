const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://satyam:satyam123@satyamtomar.2cabw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connection successful to mongoose");
  });
};

module.exports = connectToMongo;
