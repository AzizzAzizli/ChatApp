const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
require("./db/connection");

const Users = require("./models/Users");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {});

app.post("/api/register", async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    if (!email || !password || !fullName) {
      res.status(400).send("Please fill the all required fields");
    } else {
      const isAlreadyExist = await Users.findOne({ email });

      if (isAlreadyExist) {
        res.status(404).send("User already exists");
      } else {
        const newUser = new Users({ fullname, email });

        bcryptjs.hash(password, 10, (error, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res.status(200).send("User registered successfully");
      }
    }
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send("Please fill the all required fields");
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(400).send("User email or password is incorrect");
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res.status(400).send("User  password is incorrect");
        } else {
          const payload = {
            userId: user._id,
            email: user.email,
          };
          const JWT_SECRET_KEY =
            process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";
          jsonwebtoken.sign(
            payload,
            JWT_SECRET_KEY,
            { expiresIn: 84600 },
            async (error, token) => {
              await Users.findOne(
                { _id: user._id },
                {
                  $set: { token },
                }
              );
              user.save();
              next();
            }
          );
          res.status(200).json({user:{email:user.email,fullname:user.fullname,token:user.token}});
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Server is running");
});
