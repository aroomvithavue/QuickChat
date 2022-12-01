// This file must be in the /api folder for Vercel to detect it as a serverless function
import type { Request, Response } from "express";
import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import path from "path";
import logger from "morgan";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { chatRoomRouter } from "../chatroom/router";
import { Server } from "socket.io";
import ChatRoomCollection from "../chatroom/collection";

const cors = require("cors");

// Load environmental variables
dotenv.config({});

// Connect to mongoDB
const mongoConnectionUrl = process.env.MONGO_SRV;
if (!mongoConnectionUrl) {
  throw new Error("Please add the MongoDB connection SRV as 'MONGO_SRV'");
}

mongoose
  .connect(mongoConnectionUrl)
  .then((m) => {
    console.log("Connected to MongoDB");
    const db = m.connection;
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message as string}`);
  });

mongoose.connection.on("error", (err) => {
  console.error(err);
});

// Initalize an express app
const app = express();

// Set CORS to allow all
app.use(cors());

// Declare the root directory
app.use(express.static(path.join(__dirname, "../public")));

// View engine setup
app.engine("html", engine({ extname: ".html", defaultLayout: false }));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "../public"));

// Set the port
app.set("port", process.env.PORT || 3000);

// Log requests in the terminal
app.use(logger("dev"));

// Parse incoming requests with JSON payloads ('content-type: application/json' in header)
app.use(express.json());

// Parse incoming requests with urlencoded payloads ('content-type: application/x-www-form-urlencoded' in header)
app.use(express.urlencoded({ extended: false }));

// Initialize cookie session
app.use(
  session({
    secret: "61040",
    resave: true,
    saveUninitialized: false,
  })
);

// This makes sure that if a user is logged in, they still exist in the database
// Next line is from A5 starter code. I commented it out as userValidator was deleted, but might be needed in the future
// app.use(userValidator.isCurrentSessionUserExists);

// GET home page
app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

// Add routers from routes folder
app.use("/api/chatRooms", chatRoomRouter);

// Catch all the other routes and display error message
app.all("*", (req: Request, res: Response) => {
  res.status(400).render("error");
});

// Create server to listen to request at specified port
const server = http.createServer(app);
server.listen(app.get("port"), () => {
  console.log(
    `Express server running at http://localhost:${app.get("port") as number}`
  );
});

// Socket.io
const io = new Server(server, {
  // Create websocket endpoint so that server & client can talk to each other
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users: Record<string, string> = {}; // Temporary array to save socketId-username pairs. In practice, use mongodb.

io.on("connection", (socket) => {
  socket.broadcast.emit("join", {
    id: new Date().getTime(),
    text: "A new user joined.",
    username: "Server",
    userId: "",
  });
  users[socket.id] = "Anonymous";

  socket.on("join-room", (data) => {
    socket.join(data.roomName);
  });

  socket.on("leave-room", (data) => {
    socket.leave(data.roomName);
  });

  socket.on("message", async (data) => {
    await ChatRoomCollection.updateOneByKeyword(
      data.roomName,
      data.text,
      data.username
    );
    socket.to(data.roomName).emit("message:received", data);
  });

  socket.on("confusedVote", async (data) => {
    const GroupVibeCollectionNOTREAL = "Is a Placeholder Collection"
    const updateOneNOTREAL = "Is A Placeholder Function Within Collection"
    // updateOneNOTREAL should take in a reaction, username, and chatroomKey and update the counts for the emojis and handle one user voting and handling toggling. In the end, it should return a json object like {happy: #count, confused: #count}
    const totalCounts = await GroupVibeCollectionNOTREAL.updateOneNOTREAL(
      data.reaction,
      data.user,
      data.chatroomKey
    );
    socket.to(data.roomName).emit("confusedVote:received", totalCounts);
  });

  socket.on("happyVote", async (data) => {
    const GroupVibeCollectionNOTREAL = "Is a Placeholder Collection"
    const updateOneNOTREAL = "Is A Placeholder Function Within Collection"
    // updateOneNOTREAL should take in a reaction, username, and chatroomKey and update the counts for the emojis and handle one user voting and handling toggling. In the end, it should return a json object like {happy: #count, confused: #count}
    const totalCounts = await GroupVibeCollectionNOTREAL.updateOneNOTREAL(
      data.reaction,
      data.user,
      data.chatroomKey
    );
    socket.to(data.roomName).emit("happyVote:received", totalCounts);
  });

  socket.on("username", (data) => {
    users[data.userId] = data.newUsername;
    socket.broadcast.emit("username:received", data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      id: new Date().getTime(),
      text: `User ${users[socket.id]} left.`,
      username: "Server",
      userId: "",
    });
  });
});
