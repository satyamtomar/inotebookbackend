const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://satyam:satyam123@cluster0.epcqmil.mongodb.net/";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connection successful to mongoose");
  });
};

module.exports = connectToMongo;
