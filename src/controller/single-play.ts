import { GameSessionRepository, singlePlayerBotId } from "../repository/game-session";
import { WebSocket } from "ws";
import { respond } from "../utils/send-response";
import { MessageType } from "../utils/message-types";

export const singlePlay = async (game: GameSessionRepository, ws: WebSocket) => {
  const user = game.users.getUser(ws);

  const gameSession = await game.addGameSession(user.id, singlePlayerBotId);

  respond(ws, MessageType.create_game, {
    idGame: gameSession.id,
    idPlayer: user.id
  });
}
