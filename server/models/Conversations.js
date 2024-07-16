const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conversations = mongoose.model("Conversation", conversationSchema);
module.exports = Conversations;
