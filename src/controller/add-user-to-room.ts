import { GameSessionRepository } from "../repository/game-session";
import { Message, MessageType } from "../utils/message-types";
import { type WebSocket } from "ws";
import { respond } from "../utils/send-response";
import { updateRoom } from "./update-state";

export const addUserToRoom = async (game: GameSessionRepository, ws: WebSocket, message: Message) => {
  const userId2 = game.users.getUser(ws)?.id;
  const room = await game.users.addUserToRoom(message.data.indexRoom, userId2);
  if (room) {
    const user1 = game.users.getUserById(room.idUser1);

    const gameSession = await game.addGameSession(room.idUser1, userId2);

    respond(ws, MessageType.create_game, {
      idGame: gameSession.id,
      idPlayer: userId2
    });

    respond(user1.ws, MessageType.create_game, {
      idGame: gameSession.id,
      idPlayer: room.idUser1
    });

    await updateRoom(game);
  }
}
