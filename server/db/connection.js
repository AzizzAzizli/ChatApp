const mongoose = require("mongoose");

const dbURL =
  "mongodb+srv://azizazizli:YmHhgppOxdzYtMMn@cluster0.3htdb79.mongodb.net/ChatApp?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB Errror: ", err);
  });
