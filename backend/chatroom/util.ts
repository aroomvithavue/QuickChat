import type { HydratedDocument, Types } from "mongoose";
import moment from "moment";
import type { ChatRoom } from "./model";
import { words } from "../common/wordlist";

export type ChatRoomResponse = {
  _id: Types.ObjectId;
  keyword: string;
  dateCreated: Date;
  expireAt: Date;
  password: String;
  messages: Array<{ text: string; date: Date; author: string }>;
  files: Array<{fileId: string, date: Date}>;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 * Transform a raw ChatRoom object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<ChatRoom>} chatRoom - a chat room
 * @returns {ChatRoomResponse} - the chat room object formatted for the frontend
 */
const constructChatRoomResponse = (
  chatRoom: HydratedDocument<ChatRoom>
): ChatRoomResponse => {
  const chatRoomCopy: ChatRoom = {
    ...chatRoom.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };

  return {
    ...chatRoomCopy,
  };
};

const generateKeyword = (): string => {
  return words[Math.floor(Math.random() * words.length)];
};

export { constructChatRoomResponse, generateKeyword };
