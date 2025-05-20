import { GameSessionRepository } from "../repository/game-session";
import { logger, setColor } from "../utils/logger";
import { MessageType } from "../utils/message-types";
import { updateRoom } from "./update-state";
import { type WebSocket } from "ws";
import { EOL } from 'node:os';

export const createRoom = async (game: GameSessionRepository, ws: WebSocket) => {
  const user = await game.users.getUser(ws);
  try{
    await game.users.addRoom(user.id);
    await updateRoom(game);
    
    const message = `Player ${setColor(user.name, 'blue')} created a room. Player ${setColor(user.name, 'blue')} is added to the room`;
    logger(MessageType.create_room, message);
  } catch (error) {
    logger(MessageType.create_room, `Player ${setColor(user.name, 'red')} failed to create a room.${EOL}Error: ${error}`);
  }
}
