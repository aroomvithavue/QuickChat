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
import { groupVibeRouter } from "../group_vibe/router";
import { Server } from "socket.io";
import ChatRoomCollection from "../chatroom/collection";
import GroupVibeCollection from "../group_vibe/collection";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import * as chatRoomValidator from "../chatroom/middleware";

const cors = require("cors");

// Load environmental variables
dotenv.config({});

// Connect to mongoDB
const mongoConnectionUrl = process.env.MONGO_SRV;
if (!mongoConnectionUrl) {
  throw new Error("Please add the MongoDB connection SRV as 'MONGO_SRV'");
}

let bucket: any;

mongoose
  .connect(mongoConnectionUrl)
  .then((m) => {
    console.log("Connected to MongoDB");
    const db = m.connection.db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "newBucket",
    });
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message as string}`);
  });

mongoose.connection.on("error", (err) => {
  console.error(err);
});

const storage = new GridFsStorage({
  url: mongoConnectionUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "newBucket",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

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
app.use("/api/groupVibes", groupVibeRouter);

app.post(
  "/api/chatRooms/:chatRoomId/files",
  [chatRoomValidator.doesChatRoomExist, upload.single("file")],
  async (req: Request, res: Response) => {
    if (req.file === undefined) {
      return res.status(400).json({
        err: `No file provided`,
      });
    }
    const file: any = req.file;
    const id = req.params.chatRoomId;
    const fileId = file.id;
    const filename = file.filename;
    ChatRoomCollection.addFile(id, fileId, filename);
    const response = { file };
    res.status(201).json(response);
  }
);

app.get("/api/files/:id", async (req, res) => {
  const validFormat = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validFormat) {
    return res.status(400).json({
      err: `Inavlid ObjectId format`,
    });
  }
  const query = await bucket.find({
    _id: new mongoose.Types.ObjectId(req.params.id),
  });
  const files: Array<any> = await query.toArray();
  if (files.length === 0) {
    return res.status(404).json({
      err: `no file with id ${req.params.id} exist`,
    });
  }
  bucket
    .openDownloadStream(new mongoose.Types.ObjectId(req.params.id))
    .pipe(res);
});

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

  socket.on("leave-room", async (data) => {
    const totalCounts = await GroupVibeCollection.deleteAllByUser(
      data.roomName,
      data.uid
    );
    socket.to(data.roomName).emit("leftRoomGroupVibeUpdated", totalCounts);
    socket.leave(data.roomName);
  });

  socket.on("message", async (data) => {
    await ChatRoomCollection.updateOneByKeyword(
      data.roomName,
      data.text,
      data.author,
      data.uid
    );
    socket.to(data.roomName).emit("message:received", data);
  });

  socket.on("confusedVote", async (data) => {
    const totalCounts = await GroupVibeCollection.updateOne(
      data.chatroomKey,
      data.reaction,
      data.uid
    );
    socket.to(data.chatroomKey).emit("confusedVote:received", totalCounts);
  });

  socket.on("happyVote", async (data) => {
    const totalCounts = await GroupVibeCollection.updateOne(
      data.chatroomKey,
      data.reaction,
      data.uid
    );
    socket.to(data.chatroomKey).emit("happyVote:received", totalCounts);
  });
  socket.on("fileChange", async (data) => {
    socket.to(data.roomName).emit("fileChange:received", data);
  });

  socket.on("username", async (data) => {
    await ChatRoomCollection.updateAuthorInMessage(
      data.chatroomKey,
      data.newUsername,
      data.uid
    );
    socket.to(data.chatroomKey).emit("username:received", data);
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
