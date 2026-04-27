const mongoose = require("mongoose");
const colors = import("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://sanketk1845:SanTush45@cluster0.ove3cql.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}` .cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}` .red.bold);
    process.exit();
  }
};

module.exports = connectDB;