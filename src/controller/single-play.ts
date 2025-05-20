import { GameSessionRepository, singlePlayerBotId } from "../repository/game-session";
import { WebSocket } from "ws";
import { respond } from "../utils/send-response";
import { MessageType } from "../utils/message-types";
import { logger, setColor } from "../utils/logger";

export const singlePlay = async (game: GameSessionRepository, ws: WebSocket) => {
  const user = await game.users.getUser(ws);

  const gameSession = await game.addGameSession(user.id, singlePlayerBotId);

  logger(MessageType.single_play, `Player ${setColor(user.name, 'blue')} joined the game with a bot.`);

  respond(ws, MessageType.create_game, {
    idGame: gameSession.id,
    idPlayer: user.id
  });
}
