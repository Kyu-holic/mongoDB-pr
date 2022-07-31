const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { User } = require("./models/User");

const MONGO_URI =
  "mongodb+srv://khhan1990:hankyu5134@mongodbpr.afibsec.mongodb.net/BlogService?retryWrites=true&w=majority";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.use(express.json());

    app.get("/user", async (req, res) => {
      try {
        const users = await User.find({});
        return res.send({ users });
      } catch (err) {
        return res.status(500).send({ err: err.message });
      }
    });

    app.get("/user/:userId", async (req, res) => {
      try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
          return res.status(400).send({ err: "user is not valid" });
        const user = await User.findOne({ _id: userId });
        return res.send({ user });
      } catch (err) {
        return res.status(500).send({ err: err.message });
      }
    });

    app.post("/user", async (req, res) => {
      try {
        let { username, name } = req.body;
        if (!username)
          return res.status(400).send({ err: "username is required" });
        if (!name || !name.first || !name.last)
          return res
            .status(400)
            .send({ err: "both first and last names are required" });
        const user = new User(req.body);
        await user.save();
        return res.send({ user });
      } catch (err) {
        console.log(err);
        return res.status(400).send({ err: err.message });
      }
    });

    app.delete("/user/:userId", async (req, res) => {
      try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
          return res.status(400).send({ err: "userId is Invalid" });
        const user = await User.findOneAndDelete({ _id: userId });
        return res.send({ user });
      } catch (err) {
        return res.status(500).send({ err: err.message });
      }
    });

    app.put("/user/:userId", async (req, res) => {
      try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
          return res.status(400).send({ err: "user is invalid" });
        const { age, name } = req.body;
        if (!age && !name)
          return res.status(400).send({ err: "age or name is required" });
        if (age && typeof age !== "number")
          return res.status(400).send({ err: "age must be number" });
        if (
          name &&
          typeof name.first !== "string" &&
          typeof name.last !== "string"
        )
          return res.status(400).send({ err: "name must be a string" });
        let user = await User.findById(userId);
        if (age) user.age = age;
        if (name) user.name = name;
        await user.save();
        return res.send({ user });
      } catch (err) {
        return res.status(500).send({ err: err.message });
      }
    });

    app.listen(3000, () => {
      console.log("server listening on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
