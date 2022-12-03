import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";

export type ChatRoom = {
  _id: Types.ObjectId;
  keyword: string;
  dateCreated: Date;
  dateExpired: Date;
  messages: Array<{ text: string; date: Date; author: string }>;
  files: Array<{ fileId: string; date: Date }>;
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
  dateExpired: {
    type: Date,
    required: true,
  },
  messages: [
    {
      type: { text: String, date: Date, author: String },
      required: false,
    },
  ],
  files: [
    {
      type: { fileId: String, date: Date },
      required: false,
    },
  ],
});

const ChatRoomModel = model<ChatRoom>("ChatRoom", ChatRoomSchema);
export default ChatRoomModel;
