import { GameSessionRepository, singlePlayerBotId } from "../repository/game-session";
import { Message, MessageType } from "../utils/message-types";
import { respond } from "../utils/send-response";
import { type WebSocket } from "ws";

export const addShips = async (game: GameSessionRepository, ws: WebSocket, message: Message) => {
  const { gameId, indexPlayer, ships } = message.data;
  const result = await game.addShips(gameId, indexPlayer, ships);

  if (result) {
    const isReady = await game.checkGameSessionReady(gameId);
    if (isReady) {
      const gameSession = await game.getGameSession(gameId);
      const player1 = await game.getPlayerData(gameId, gameSession?.idPlayer1);
      const player2 = await game.getPlayerData(gameId, gameSession?.idPlayer2);
      const ws1 = game.users.getUserById(gameSession?.idPlayer1)?.ws;
      const ws2 = game.users.getUserById(gameSession?.idPlayer2)?.ws;

      respond(ws2, MessageType.start_game, { ships: player2?.ships, currentPlayerIndex: gameSession?.idPlayer2 });
      respond(ws1, MessageType.start_game, { ships: player1?.ships, currentPlayerIndex: gameSession?.idPlayer1 });

      respond(ws1, MessageType.turn, {
        currentPlayer: gameSession?.idPlayer1,
      });
      respond(ws2, MessageType.turn, {
        currentPlayer: gameSession?.idPlayer1,
      });
    }
    const isSinglePlayer = await game.isSinglePlayer(gameId);
    if (isSinglePlayer) {
      const result = await game.addShips(gameId, singlePlayerBotId, ships);
      if (result) {
        respond(ws, MessageType.start_game, { ships: ships, currentPlayerIndex: indexPlayer });
        respond(ws, MessageType.turn, {
          currentPlayer: indexPlayer,
        });
      }
    }
  }
}
