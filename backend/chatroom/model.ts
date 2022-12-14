import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";

export type ChatRoom = {
  _id: Types.ObjectId;
  keyword: string;
  dateCreated: Date;
  expireAt: Date;
  password: String;
  messages: Array<{ text: string; date: Date; author: string; uid: string }>;
  files: Array<{ fileId: string; filename: string; date: Date }>;
};

const ChatRoomSchema = new Schema<ChatRoom>({
  keyword: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  expireAt: {
    type: Date,
    expires: 0,
    index: true,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  messages: [
    {
      type: { text: String, date: Date, author: String, uid: String },
      required: false,
    },
  ],
  files: [
    {
      type: { fileId: String, filename: String, date: Date },
      required: false,
    },
  ],
});

const ChatRoomModel = model<ChatRoom>("ChatRoom", ChatRoomSchema);
export default ChatRoomModel;
