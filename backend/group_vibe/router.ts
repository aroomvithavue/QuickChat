import type {NextFunction, Request, Response} from "express";
import express from "express";
import GroupVibeCollection from "./collection";
import ChatRoomCollection from "../chatroom/collection";
import * as groupVibeValidator from "./middleware";

const router = express.Router();

/**
 * Get happy and sad counts for a group vibe based on a chat room keyword.
 *
 * @name GET /api/groupVibes?keyword=key
 * 
 * @return {{happy: number, confused: number}} - happy and confused counts for the chat room with the given keyword
 * @throws {400} - if keyword is not given
 * @throws {404} - if no chat room has given keyword
 *
 */
router.get(
  "/",
  [groupVibeValidator.doesChatWithKeyExist("query")],
  async (req: Request, res: Response, next: NextFunction) => {
    const chatroom = await ChatRoomCollection.findByKeyword(req.query.keyword as string);
    let groupVibe = await GroupVibeCollection.findByChatId(chatroom._id);

    if (!groupVibe || groupVibe === null){
        groupVibe = await GroupVibeCollection.addOne(chatroom._id);
    }

    const groupVibeCounts = await GroupVibeCollection.findOneCounts(groupVibe._id);
    return res.status(200).json(groupVibeCounts);
  }
);

/**
 * Modify a group vibe (by adding a reaction).
 *
 * @name PATCH /api/groupVibes
 *
 * @param {string} keyword - the keyword of the chat room
 * @param {string} reaction - reaction
 * @param {string} user - user
 * @return {{happy: number, confused: number}} - the updated happy and confused counts
 * @throws {400} - if keyword is not given
 * @throws {404} - if no chat room has given keyword
 * @throws {400} - if the reaction is not "happy" or "confused"
 * @throws {400} - if the user is empty
 */
router.patch(
  "/",
  [groupVibeValidator.doesChatWithKeyExist("body"), groupVibeValidator.isValidReaction],
  async (req: Request, res: Response) => {
    const keyword = req.body.keyword as string;
    const reaction = req.body.reaction as "happy" | "confused";
    const user = req.body.user as string;
    
    const groupVibeCounts = await GroupVibeCollection.updateOne(keyword, reaction, user);
    res.status(200).json(groupVibeCounts);
  }
);

/**
 * Delete a group vibe.
 *
 * @name DELETE /api/groupVibes/:id
 *
 * @return {string} - a success message
 * @throws {404} - if the groupVibeId is not valid
 */
router.delete(
    "/:groupVibeId?",
    [groupVibeValidator.doesGroupVibeExist],
    async (req: Request, res: Response) => {
      await GroupVibeCollection.deleteOne(req.params.groupVibeId);
      res.status(200).json("Your group vibe was deleted successfully.");
    }
);

export {router as groupVibeRouter};