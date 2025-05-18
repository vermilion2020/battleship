import type { RawData, WebSocket } from "ws";
import { getBody } from "./get-body";
import { MessageType } from "./message-types";
import { GameSessionRepository } from "../repository/game-session";
import { register } from "../controller/register";
import { addUserToRoom } from "../controller/add-user-to-room";
import { createRoom } from "../controller/create-room";
import { addShips } from "../controller/add-ships";
import { attack } from "../controller/attack";
import { singlePlay } from "../controller/single-play";
import { logger } from "./logger";

export const messageHandler = async (gameSessionRepository: GameSessionRepository, ws: WebSocket, rawMessage: RawData) => {
  const message = getBody(rawMessage);

  try {
    switch (message.type) {
      case MessageType.reg:
        await register(gameSessionRepository, ws, message);
        break;

      case MessageType.create_room:
        await createRoom(gameSessionRepository, ws);
        break;

      case MessageType.add_user_to_room:
        await addUserToRoom(gameSessionRepository, ws, message);
        break;
        
      case MessageType.add_ships:
        await addShips(gameSessionRepository, ws, message);
        break;

      case MessageType.attack:
      case MessageType.randomAttack:  
        await attack(gameSessionRepository, ws, message);
        break;
      
      case MessageType.single_play:
        await singlePlay(gameSessionRepository, ws);
        break;
    }
  } catch (error) {
    logger(message.type, error);
  }
};
