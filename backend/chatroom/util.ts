import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {ChatRoom, PopulatedChatRoom} from './model';

type ChatRoomResponse = {
  _id: string;
  keyword: string;
  dateCreated: string;
  dateExpired: string;
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
  const chatRoomCopy: PopulatedChatRoom = {
    ...chatRoom.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  
  return {
    ...chatRoomCopy,
    _id: chatRoomCopy._id.toString(),
    keyword: chatRoom.keyword,
    dateCreated: formatDate(chatRoom.dateCreated),
    dateExpired: formatDate(chatRoom.dateExpired),
    messages: chatRoom.messages
  };
};

export {
  constructChatRoomResponse
};