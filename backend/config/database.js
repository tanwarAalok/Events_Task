const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongodb connected with server");
    })
    .catch((e) => {
      console.log("Error: ", e);
    });
};

module.exports = connectDatabase;
