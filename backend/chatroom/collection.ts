import type {HydratedDocument, Types} from "mongoose";
import type {ChatRoom} from "./model";
import ChatRoomModel from "./model";

class ChatRoomCollection {
  
  /**
   * Create a new chat room.
   * 
   * @param duration time until chat expires
   * @param chatKeyword keyword of chat
   * @returns {Promise<HydratedDocument<ChatRoom>>} - the newly created chat room
   */
  static async addOne(days: string, hours: string, chatKeyword: string): Promise<HydratedDocument<ChatRoom>> {
    const date = new Date();
    const date2 = new Date();
    date2.setDate(date2.getDate() + Number(days));
    date2.setHours(date2.getHours() + Number(hours));
    
    const chatroom = new ChatRoomModel({ 
      keyword: chatKeyword,
      dateCreated: date,  
      dateExpired: date2,  
      messages: []
    });
    
    await chatroom.save();
    return chatroom;
  }

  /**
   * Find a chat room by id.
   * 
   * @param chatRoomId id of chat room to find
   * @returns {Promise<HydratedDocument<ChatRoom>> | Promise<null> } - the chat room with the given id, if any
   */
  static async findOne(chatRoomId: Types.ObjectId | string): Promise<HydratedDocument<ChatRoom>> {
    return ChatRoomModel.findOne({_id: chatRoomId});
  }

  /**
   * Finds a chat room by its corresponding keyword.
   * 
   * @param chatKeyword keyword of chat room
   * @returns {Promise<HydratedDocument<ChatRoom>> | Promise<null> } - the chat room with the given keyword, if any
   */
   static async findByKeyword(chatKeyword: string): Promise<HydratedDocument<ChatRoom>> {
    return ChatRoomModel.findOne({keyword: chatKeyword});
  }

  /**
   * Gets all of the chat rooms in the database, sorted by the most recently created.
   * 
   * @returns {Promise<HydratedDocument<ChatRoom>[]>} - an array of all of the chat rooms
   */
  static async findAll(): Promise<Array<HydratedDocument<ChatRoom>>> {
    return ChatRoomModel.find({}).sort({dateCreated: -1});
  }

  /**
   * Update a chat by adding a new message.
   * 
   * @param chatRoomId id of chat room
   * @param messageText text of new message
   * @param messageAuthor author of new message
   * @returns {Promise<HydratedDocument<ChatRoom>>} - the newly updated chat room
   */
  static async updateOne(chatRoomId: Types.ObjectId | string, messageText: string, messageAuthor: string): Promise<HydratedDocument<ChatRoom>> {
    const chatroom = await ChatRoomModel.findOne({_id: chatRoomId});
    const messageDate = new Date();
    chatroom.messages.push({text: messageText, date: messageDate, author: messageAuthor});
    await chatroom.save();
    return chatroom;
  }

    /**
   * Update a chat by adding a new message. Differs from prior function in that it identifies
   * the chat by keyword, rather than by id.
   * 
   * @param chatKeyword keyword of chat room
   * @param messageText text of new message
   * @param messageAuthor author of new message
   * @returns {Promise<HydratedDocument<ChatRoom>>} - the newly updated chat room
   */
     static async updateOneByKeyword(chatKeyword: string | string, messageText: string, messageAuthor: string): Promise<HydratedDocument<ChatRoom>> {
      const chatroom = await ChatRoomModel.findOne({keyword: chatKeyword});
      const messageDate = new Date();
      chatroom.messages.push({text: messageText, date: messageDate, author: messageAuthor});
      await chatroom.save();
      return chatroom;
    }

  /**
   * Deletes a chat room by id.
   * 
   * @param chatRoomId id of chat room
   * @returns {Promise<Boolean>} - true if the chat room has been deleted, false otherwise
   */
  static async deleteOne(chatRoomId: Types.ObjectId | string): Promise<boolean> {
    const chatRoom = await ChatRoomModel.findOneAndDelete({_id: chatRoomId});
    return chatRoom !== null;
  }
}

export default ChatRoomCollection;