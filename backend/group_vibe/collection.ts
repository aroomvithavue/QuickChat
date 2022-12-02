import type {HydratedDocument, Types} from "mongoose";
import type {GroupVibe} from "./model";
import GroupVibeModel from "./model";
import ChatRoomCollection from "../chatroom/collection";

class GroupVibeCollection {
  /**
   * Add a group vibe.
   *
   * @param {string} chatroom - id of chat room
   * @return {Promise<HydratedDocument<GroupVibe>>} - new group vibe
   */
  static async addOne(chatroom: Types.ObjectId | string): Promise<HydratedDocument<GroupVibe>> {
    
    const groupVibe = new GroupVibeModel({
        chatroom, 
        happy: [], 
        confused: []
    });
    
    await groupVibe.save();
    return groupVibe;
  }

  /**
   * Find a group vibe by id.
   *
   * @param groupVibeId id of group vibe to find
   * @returns {Promise<HydratedDocument<GroupVibe>> | Promise<null> } - the group vibe with the given id, if any
   */
   static async findOne(groupVibeId: Types.ObjectId | string): Promise<HydratedDocument<GroupVibe>> {
    return GroupVibeModel.findOne({ _id: groupVibeId });
  }

  /**
   * Find group vibe counts by id.
   *
   * @param groupVibeId id of group vibe to find
   * @returns {Promise<{happy: number, confused: number}>} - the group vibe counts with the given id
   */
   static async findOneCounts(groupVibeId: Types.ObjectId | string): Promise<{happy: number, confused: number}> {
    const groupVibe = await GroupVibeModel.findOne({ _id: groupVibeId });
    const happyCount = groupVibe.happy.length;
    const confusedCount = groupVibe.confused.length;
    return {happy: happyCount, confused: confusedCount};
  }

  /**
   * Find a group vibe by its corresponding chat room id.
   *
   * @param chatroom id of chat room
   * @returns {Promise<HydratedDocument<GroupVibe>> | Promise<null> } - the group vibe with the given chat room id, if any
   */
   static async findByChatId(chatroom: Types.ObjectId | string): Promise<HydratedDocument<GroupVibe>> {
    return GroupVibeModel.findOne({ chatroomId: chatroom });
  }

  /**
   * Get if a user has made a specific reaction.
   *
   * @param {string} groupVibeId - id of group vibe
   * @param {string} user - string
   * @param {string} reaction - "happy" | "confused"
   *
   * @return {Promise<boolean>}
   */
  static async findReactionByUser(groupVibeId: Types.ObjectId | string, user: string, reaction: "happy" | "confused"): Promise<boolean> {
    
    const groupVibe = await GroupVibeModel.findOne({ _id: groupVibeId });

    if (groupVibe !== null){
        if (reaction === "happy"){
            const happyArr = groupVibe.happy;
            if (happyArr.includes(user)){
                return true;
            }
        }
        else if (reaction === "confused"){
            const confusedArr = groupVibe.confused;
            if (confusedArr.includes(user)){
                return true;
            }
        }
    }

    return false;
  }

  /**
   * Update a group vibe by adding a user to a reaction.
   *
   * @param groupVibeId - id of group vibe
   * @param reaction - reaction
   * @param user - user
   * @returns {Promise<HydratedDocument<GroupVibe>>} - the newly updated group vibe
   */
   static async updateOneAdd(groupVibeId: Types.ObjectId | string, reaction: "happy" | "confused", user: string): Promise<HydratedDocument<GroupVibe>> {
    
    const groupVibe = await GroupVibeModel.findOne({ _id: groupVibeId });

    if (reaction === "happy"){
        groupVibe.happy.push(user);
    }
    else if (reaction === "confused"){
        groupVibe.confused.push(user);
    }
    
    await groupVibe.save();
    return groupVibe;
  }

  /**
   * Update a group vibe by deleting a user from a reaction.
   *
   * @param groupVibeId - id of group vibe
   * @param reaction - reaction
   * @param user - user
   * @returns {Promise<HydratedDocument<GroupVibe>>} - the newly updated group vibe
   */
   static async updateOneDelete(groupVibeId: Types.ObjectId | string, reaction: "happy" | "confused", user: string): Promise<HydratedDocument<GroupVibe>> {
    
    const groupVibe = await GroupVibeModel.findOne({ _id: groupVibeId });

    if (reaction === "happy"){
        for(let i = 0; i < groupVibe.happy.length; i++){                     
            if (groupVibe.happy[i] === user) { 
                groupVibe.happy.splice(i, 1); 
                i--; 
            }
        }
    }
    else if (reaction === "confused"){
        for(let i = 0; i < groupVibe.confused.length; i++){                     
            if (groupVibe.confused[i] === user) { 
                groupVibe.confused.splice(i, 1); 
                i--; 
            }
        }
    }
    
    await groupVibe.save();
    return groupVibe;
  }

  /**
   * Update a group vibe.
   *
   * @param chatroomKey - keyword that corresponds to chat room
   * @param reaction - reaction
   * @param user - user
   * @returns {Promise<{happy: number, confused: number}} - the newly updated group vibe counts
   */
   static async updateOne(chatroomKey: string, reaction: "happy" | "confused", user: string): Promise<{happy: number, confused: number}> {

    const chatroom = await ChatRoomCollection.findByKeyword(chatroomKey);
    let groupVibe = await GroupVibeModel.findOne({ chatroomId: chatroom._id });

    if (!groupVibe || groupVibe === null){
        groupVibe = await GroupVibeCollection.addOne(chatroom._id);
    }

    const reactionExists = await GroupVibeCollection.findReactionByUser(groupVibe._id, user, reaction);

    if (reactionExists){
        groupVibe = await GroupVibeCollection.updateOneDelete(groupVibe._id, reaction, user);
    }
    else{
        groupVibe = await GroupVibeCollection.updateOneAdd(groupVibe._id, reaction, user);
    }
    
    await groupVibe.save();

    const happyCount = groupVibe.happy.length;
    const confusedCount = groupVibe.confused.length;
    return {happy: happyCount, confused: confusedCount};
  }

  /**
   * Delete a group vibe by id.
   *
   * @param groupVibeId id of group vibe
   * @returns {Promise<Boolean>} - true if the group vibe has been deleted, false otherwise
   */
   static async deleteOne(groupVibeId: Types.ObjectId | string): Promise<boolean> {
    const groupVibe = await GroupVibeModel.findOneAndDelete({ _id: groupVibeId });
    return groupVibe !== null;
  }
}

export default GroupVibeCollection;