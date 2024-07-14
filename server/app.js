const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
require("./db/connection");
const cors = require("cors");
const Users = require("./models/Users");
const Conversations = require("./models/Conversation");
const Messages = require("./models/Messages");
const Conversation = require("./models/Conversation");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {});

app.post("/api/register", async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    if (!email || !password || !fullname) {
      res
        .status(400)
        .send({ message: "Please fill the all required fields", status: 400 });
    } else {
      const isAlreadyExist = await Users.findOne({ email });

      if (isAlreadyExist) {
        res.status(400).send({ message: "User already exists", status: 400 });
      } else {
        const newUser = new Users({ fullname, email });

        bcryptjs.hash(password, 10, (error, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res
          .status(200)
          .send({ message: "User registered successfully", status: 200 });
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
      res
        .status(400)
        .send({ message: "Please fill the all required fields", status: 400 });
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res
          .status(400)
          .send({
            message: "User email or password is incorrect",
            status: 400,
          });
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res
            .status(400)
            .send({ message: "User  password is incorrect", status: 400 });
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
              await Users.updateOne(
                { _id: user._id },
                {
                  $set: { token },
                }
              );

              user.save();
              return res.status(200).send({
                message: "Logged in successfully",
                status: 200,
                user: {
                  id: user._id,
                  email: user.email,
                  fullname: user.fullname,
                },
                token: token,
              });
            }
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/conversation", async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;

    const newConversation = new Conversations({
      members: [senderId, receiverId],
    });

    await newConversation.save();
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/conversations/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });
    const conversationUserData = Promise.all(
      conversations.map(async (conversation) => {
        const recieverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await Users.findById(recieverId);
        return {
          user: {receiverId:user._id,  email: user.email, fullname: user.fullname },
          conversationId: conversation._id,
        };
      })
    );
    res.status(200).send(await conversationUserData);
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    if (!senderId || !message)
      return res.status(400).send("Please fill the all required fields");

    if (!conversationId && receiverId) {
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      const newMessage = new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      res.status(200).send("Message sent successfully");
    } else {
      return res.status(400).send("Please fill the all required fields");
    }
    const newMessage = new Messages({ conversationId, senderId, message });

    await newMessage.save();

    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/message/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    if (conversationId === "new") return res.status(200).json([]);
    const messages = await Messages.find({ conversationId });
    const messageUserData = Promise.all(
      messages.map(async (message) => {
        const user = await Users.findById(message.senderId);
        return {
          user: { id:user._id, email: user.email, fullname: user.fullname },
          message: message.message,
        };
      })
    );
    res.status(200).json(await messageUserData);
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await Users.find();
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: { email: user.email, fullname: user.fullname },
          userId: user._id,
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    log.error(error);
  }
});

app.listen(port, () => {
  console.log("Server is running", port);
});
