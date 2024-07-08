const express = require("express");

require("./db/connection");

const Users=require('./models/Users')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {});

app.listen(port, () => {
  console.log("Server is running");
});
