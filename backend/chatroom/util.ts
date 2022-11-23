import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {ChatRoom} from './model';

export type ChatRoomResponse = {
  _id: Types.ObjectId;
  keyword: string;
  dateCreated: Date;
  dateExpired: Date;
  messages: Array<{text: String, date: Date, author: String}>;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw ChatRoom object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<ChatRoom>} chatRoom - a chat room
 * @returns {ChatRoomResponse} - the chat room object formatted for the frontend
 */
const constructChatRoomResponse = (chatRoom: HydratedDocument<ChatRoom>): ChatRoomResponse => {
  const chatRoomCopy: ChatRoom = {
    ...chatRoom.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  
  return {
    ...chatRoomCopy
  };
};

export {
  constructChatRoomResponse
};