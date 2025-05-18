import { GameSessionRepository } from "../repository/game-session";
import { Message, MessageType } from "../utils/message-types";
import { type WebSocket } from "ws";
import { respond } from "../utils/send-response";
import { updateRoom } from "./update-state";
import { logger, setColor } from "../utils/logger";
import { EOL } from 'node:os';

export const addUserToRoom = async (game: GameSessionRepository, ws: WebSocket, message: Message) => {
  const user2 = await game.users.getUser(ws);
  try {
    const room = await game.users.addUserToRoom(message.data.indexRoom, user2.id);
    if (room) {
      const user1 = await game.users.getUserById(room.idUser1);

      const gameSession = await game.addGameSession(room.idUser1, user2.id);

      respond(ws, MessageType.create_game, {
        idGame: gameSession.id,
        idPlayer: user2.id
      });

      respond(user1.ws, MessageType.create_game, {
        idGame: gameSession.id,
        idPlayer: room.idUser1
      });
      logger(MessageType.create_room, `Player ${setColor(user2.name, 'blue')} entered to the room.`);
      await updateRoom(game);
    }
  } catch (error) {
    logger(MessageType.create_room, `Player ${setColor(user2.name, 'red')} failed to enter to the room.${EOL}Error: ${error}`);
  }
}
