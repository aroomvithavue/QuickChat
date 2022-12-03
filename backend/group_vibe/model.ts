import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {ChatRoom} from "../chatroom/model";

export type GroupVibe = {
  _id: Types.ObjectId;
  chatroomId: Types.ObjectId;
  happy: Array<String>;
  confused: Array<String>;
};

export type PopulatedGroupVibe = {
  _id: Types.ObjectId;
  chatroomId: ChatRoom;
  happy: Array<String>;
  confused: Array<String>;
};

const GroupVibeSchema = new Schema<GroupVibe>({
  chatroomId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ChatRoom",
  },
  happy: [{
    type: String,
    required: false
  }],
  confused: [{
    type: String,
    required: false
  }]
});


const GroupVibeModel = model<GroupVibe>('GroupVibe', GroupVibeSchema);
export default GroupVibeModel;