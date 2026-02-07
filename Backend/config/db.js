const mongoose = require("mongoose");
const colors = require("colors");

const connect_DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `DB successfully connected with HOST: ${mongoose.connection.host}`
        .bgGreen,
    );
    return;
  } catch (error) {
    console.log("DB Error:".bgRed, error.message.bgRed);
    process.exit(1); // Exit the process if DB connection fails
  }
};

module.exports = connect_DB;
