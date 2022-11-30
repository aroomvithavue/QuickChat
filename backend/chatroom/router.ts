import type { NextFunction, Request, Response } from "express";
import express from "express";
import ChatRoomCollection from "./collection";
import * as chatRoomValidator from "./middleware";
import * as util from "./util";
import { Types } from "mongoose";

const router = express.Router();

/**
 * Get all the chat rooms.
 *
 * @name GET /api/chatRooms
 *
 * @return {ChatRoomResponse[]} - a list of all the chat rooms sorted in descending order by date created
 */
/**
 * Get chat room by keyword.
 *
 * @name GET /api/chatRooms?keyword=key
 *
 * @return {ChatRoomResponse} - a chat room with a corresponding keyword of key
 * @throws {400} - if keyword is not given
 * @throws {404} - if no chat room has given keyword
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.keyword !== undefined) {
      next();
      return;
    }

    const allChatRooms = await ChatRoomCollection.findAll();
    const response = allChatRooms.map(util.constructChatRoomResponse);
    res.status(200).json(response);
  },
  [chatRoomValidator.doesChatRoomWithKeyExist],
  async (req: Request, res: Response) => {
    const chatRoom = await ChatRoomCollection.findByKeyword(
      req.query.keyword as string
    );
    const response = util.constructChatRoomResponse(chatRoom);
    res.status(200).json(response);
  }
);

/**
 * Create a new chat room.
 *
 * @name POST /api/chatRooms
 *
 * @param {number} days - days until expiration
 * @param {number} hours - hours until expiration
 * @param {string} keyword - keyword of chat
 * @return {ChatRoomResponse} - the created chat room
 * @throws {400} - if the keyword is empty or corresponds to a chatroom that already exists
 * @throws {400} - if days is not a positive integer
 * @throws {400} - if hours is not a positive integer
 */
router.post(
  "/",
  [chatRoomValidator.isValidChatRoom],
  async (req: Request, res: Response) => {
    const days = req.body.days as string;
    const hours = req.body.hours as string;
    const chatRoom = await ChatRoomCollection.addOne(days, hours);

    const response = util.constructChatRoomResponse(chatRoom);
    res.status(201).json(response);
  }
);

/**
 * Delete a chat room.
 *
 * @name DELETE /api/chatRooms/:id
 *
 * @return {string} - a success message
 * @throws {404} - if the chatRoomId is not valid
 */
router.delete(
  "/:chatRoomId?",
  [chatRoomValidator.doesChatRoomExist],
  async (req: Request, res: Response) => {
    await ChatRoomCollection.deleteOne(req.params.chatRoomId);
    res.status(200).json("Your chat room was deleted successfully.");
  }
);

/**
 * Modify a chat room (by adding a message).
 *
 * @name PATCH /api/chatRooms/:id
 *
 * @param {string} message - the content of the new message
 * @param {string} author - the author of the message
 * @return {ChatRoomResponse} - the updated chat room
 * @throws {404} - if the chatRoomId is not valid
 * @throws {400} - if the message is empty
 * @throws {400} - if the author is empty
 */
router.patch(
  "/:chatRoomId?",
  [chatRoomValidator.doesChatRoomExist, chatRoomValidator.isValidMessage],
  async (req: Request, res: Response) => {
    const message = req.body.message as string;
    const author = req.body.author as string;
    const chatRoom = await ChatRoomCollection.updateOne(
      req.params.chatRoomId,
      message,
      author
    );

    const response = util.constructChatRoomResponse(chatRoom);
    res.status(200).json(response);
  }
);

export { router as chatRoomRouter };
