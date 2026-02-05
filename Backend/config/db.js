const mongoose = require("mongoose");
const colors = require("colors");

const connect_DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `DB successfully connect with PORT: ${mongoose.connection.host}`.bgGreen,
    );
  } catch (error) {
    console.log("DB Error : ", error, colors.bgRed);
  }
};

module.exports = connect_DB;
