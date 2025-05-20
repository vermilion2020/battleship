import { GameSessionRepository } from "../repository/game-session";
import { Message, MessageType } from "../utils/message-types";
import { respond } from "../utils/send-response";
import { type WebSocket } from "ws";
import { updateRoom, updateWinners } from "./update-state";
import { logger, setColor } from "../utils/logger";

export const register = async (game: GameSessionRepository, ws: WebSocket, message: Message) => {
  const name = message.data.name.trim();
  const password = message.data.password.trim();

  const user = await game.users.registerConnection(name, password, ws);

  respond(ws, MessageType.reg, {
    index: user.id,
    name: user.name,
    error: !!user.errorMessage,
    errorText: user.errorMessage
  });

  const loggerMessage = !user.errorMessage ? `Player ${setColor(user.name, 'blue')} successfully connected` : `Player ${setColor(name, 'red')} registration failed: ${user.errorMessage}`;

  logger(MessageType.reg, loggerMessage);

  await updateRoom(game);
  await updateWinners(game);
}
