import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ChatRoomCollection from "../chatroom/collection";
import GroupVibeCollection from "./collection";

/**
 * Checks if a chat room with keyword exists
 */
const doesChatWithKeyExist = (input: "query" | "body") => async (req: Request, res: Response, next: NextFunction) => {
  
  let keyword = '';
  if (input === "query"){
    keyword = req.query.keyword as string;
  }
  else if (input === "body"){
    keyword = req.body.keyword as string;
  }
  
  const chatRoom = await ChatRoomCollection.findByKeyword(keyword);
  if (!chatRoom) {
    res.status(404).json({
      error: `Chat room with keyword of ${req.query.keyword} does not exist.`,
    });
    return;
  }

  next();
};

/**
 * Checks if a group vibe with groupVibeId exists
 */
const doesGroupVibeExist = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.groupVibeId);
    const groupVibe = validFormat ? await GroupVibeCollection.findOne(req.params.groupVibeId) : "";
    if (!groupVibe) {
      res.status(404).json({
        error: `Group vibe with group vibe ID ${req.params.groupVibeId} does not exist.`,
      });
      return;
    }
  
    next();
};

/**
 * Checks if the new reaction is valid.
 */
const isValidReaction = async (req: Request,res: Response,next: NextFunction) => {
    const reaction = req.body.reaction as string;
    if (reaction !== "happy" && reaction !== "confused") {
      res.status(400).json({
        error: "Reaction must be either happy or confused.",
      });
      return;
    }
  
    const user = req.body.user as string;
    if (!user.trim()) {
      res.status(400).json({
        error: "User must be at least one character long.",
      });
      return;
    }
  
    next();
};
  

export {
    doesChatWithKeyExist,
    doesGroupVibeExist,
    isValidReaction,
};