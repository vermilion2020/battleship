import { GameSessionRepository } from "../repository/game-session";
import { MessageType } from "../utils/message-types";
import { respond } from "../utils/send-response";
import { type WebSocket } from "ws";

export const nextTurn = async (gameId: string, nextPlayerId: string, gameSessionRepository: GameSessionRepository, ws1: WebSocket, ws2?: WebSocket) => {
  await gameSessionRepository.setTurn(gameId, nextPlayerId);
  respond(ws1, MessageType.turn, {
    currentPlayer: nextPlayerId,
  });
  if (ws2) {
    respond(ws2, MessageType.turn, {
      currentPlayer: nextPlayerId,
    });
  }
}
