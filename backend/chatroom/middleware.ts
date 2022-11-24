import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ChatRoomCollection from './collection';

/**
 * Checks if a chat room with keyword exists
 */
const doesChatRoomWithKeyExist = async (req: Request, res: Response, next: NextFunction) => {
  const chatRoom = await ChatRoomCollection.findByKeyword(req.query.keyword as string);
  if (!chatRoom) {
    res.status(404).json({
      error: `Chat room with keyword of ${req.query.keyword} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a chat room with chatRoomId exists
 */
const doesChatRoomExist = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.chatRoomId);
  const chatRoom = validFormat ? await ChatRoomCollection.findOne(req.params.chatRoomId) : '';
  if (!chatRoom) {
    res.status(404).json({
      error: `Chat room with chat room ID ${req.params.chatRoomId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the new chat room is valid.
 */
const isValidChatRoom = async (req: Request, res: Response, next: NextFunction) => {
  const keyword = req.body.keyword as string;
  if (!keyword.trim()) {
    res.status(400).json({
      error: 'Keyword must be at least one character long.'
    });
    return;
  }

  const chatRoom = await ChatRoomCollection.findByKeyword(keyword);
  if (chatRoom) {
    res.status(400).json({
      error: `Chat room with keyword of ${req.query.keyword} already exists.`
    });
    return;
  }

  const days = req.body.days as string;
  if (Number(days) === NaN || Number(days) < 0 || Number(days) !== parseInt(days)) {
    res.status(400).json({
      error: 'Days must be a non-negative integer.'
    });
    return;
  }

  const hours = req.body.hours as string;
  if (Number(hours) === NaN || Number(hours) < 0 || Number(hours) !== parseInt(hours)) {
    res.status(400).json({
      error: 'Hours must be a non-negative integer.'
    });
    return;
  }

  next();
};

/**
 * Checks if the new message is valid.
 */
const isValidMessage = async (req: Request, res: Response, next: NextFunction) => {
  const message = req.body.message as string;
  if (!message.trim()) {
    res.status(400).json({
      error: 'Message must be at least one character long.'
    });
    return;
  }

  const author = req.body.author as string;
  if (!author.trim()) {
    res.status(400).json({
      error: 'Author must be at least one character long.'
    });
    return;
  }

  next();
};

export {
  doesChatRoomWithKeyExist,
  doesChatRoomExist,
  isValidChatRoom,
  isValidMessage
};
