const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
require("./db/connection");
const cors = require("cors");
const io = require("socket.io")(4000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const Users = require("./models/Users");
const Conversations = require("./models/Conversations");
const Messages = require("./models/Messages");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let users = [];
io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ conversationId, senderId, message, receiverId }) => {
      // console.log("messages => ", message);
      const receiver = users?.find((user) => user.userId === receiverId);
      const sender = users?.find((user) => user.userId === senderId);
      // console.log(users, " users");
      // console.log("receiver=> " + receiver, " sender=> " + sender);
      const user = await Users.findById(senderId);
      if (receiver) {
        io.to(receiver?.socketId)
          .to(sender?.socketId)
          .emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullname: user.fullname, email: user.email },
          });
      } else {
        io.to(sender?.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
          receiverId,
          user: { id: user._id, fullname: user.fullname, email: user.email },
        });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.userId !== socket.id);
    io.emit("getUsers", users);
  });
});

app.post("/api/register", async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    if (!email || !password || !fullname) {
      res
        .status(400)
        .json({ message: "Please fill the all required fields", status: 400 });
    } else {
      const isAlreadyExist = await Users.findOne({ email });

      if (isAlreadyExist) {
        res.status(400).json({ message: "User already exists", status: 400 });
      } else {
        const newUser = new Users({ fullname, email });

        bcryptjs.hash(password, 10, (error, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res
          .status(200)
          .json({ message: "User registered successfully", status: 201 });
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
        .json({ message: "Please fill the all required fields", status: 400 });
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(400).json({
          message: "User email or password is incorrect",
          status: 400,
        });
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res
            .status(400)
            .json({ message: "User  password is incorrect", status: 400 });
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
              return res.status(200).json({
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
    res
      .status(201)
      .json({ message: "Conversation created successfully", status: 201 });
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
    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await Users.findById(receiverId);
        return {
          user: {
            receiverId: user._id,
            email: user.email,
            fullname: user.fullname,
          },
          conversationId: conversation._id,
        };
      })
    );
    res.status(200).json(conversationUserData);
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    // console.log(conversationId, senderId, message, receiverId );
    if (!senderId || !message) {
      return res
        .status(400)
        .json({ message: "Please fill the all required fields", status: 400 });
    }
    if (conversationId === "new" && receiverId) {
      const newConversation = new Conversations({
        members: [senderId, receiverId],
      });
      // console.log(newConversation);
      await newConversation.save();
      const newMessage = new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      return res
        .status(201)
        .json({ message: "Message sent successfully", status: 201 });
    } else if (!conversationId && !receiverId) {
      return res
        .status(400)
        .json({ message: "Please fill the all required fields", status: 400 });
    }
    const newMessage = new Messages({ conversationId, senderId, message });

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", status: 201 });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/message/:conversationId", async (req, res) => {
  try {
    async function checkMessages(conversationId) {
      const messages = await Messages.find({ conversationId });
      const messageUserData = await Promise.all(
        messages.map(async (message) => {
          const user = await Users.findById(message.senderId);
          return {
            user: { id: user._id, email: user.email, fullname: user.fullname },
            message: message.message,
          };
        })
      );
      return res.status(200).json(messageUserData);
    }

    const conversationId = req.params.conversationId;

    if (conversationId === "new") {
      const checkConversation = await Conversations.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await Users.find({ _id: { $ne: userId } });
    const usersData = await Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullname: user.fullname,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(usersData);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Server is running", port);
});
