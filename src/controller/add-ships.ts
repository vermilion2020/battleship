import { GameSessionRepository, singlePlayerBotId } from "../repository/game-session";
import { generateShips } from "../utils/generate-map";
import { logger, logShips, setColor } from "../utils/logger";
import { Message, MessageType } from "../utils/message-types";
import { respond } from "../utils/send-response";
import { type WebSocket } from "ws";

export const addShips = async (game: GameSessionRepository, ws: WebSocket, message: Message) => {
  const { gameId, indexPlayer, ships } = message.data;
  try {
    const user = await game.users.getUser(ws);
    const result = await game.addShips(gameId, indexPlayer, ships);

    if (result) {
      logger(MessageType.add_ships, `Player ${setColor(user.name, 'blue')} successfully added ships.`);
      logShips(result as number[][]);

      const isReady = await game.checkGameSessionReady(gameId);
      if (isReady) {
        const gameSession = await game.getGameSession(gameId);
        const user2 = await game.users.getUserById(indexPlayer === gameSession?.idPlayer1 ? gameSession?.idPlayer2 : gameSession?.idPlayer1);
        const player1 = await game.getPlayerData(gameId, gameSession?.idPlayer1);
        const player2 = await game.getPlayerData(gameId, gameSession?.idPlayer2);
        const ws1 = (await game.users.getUserById(gameSession?.idPlayer1))?.ws;
        const ws2 = (await game.users.getUserById(gameSession?.idPlayer2))?.ws;

        respond(ws2, MessageType.start_game, { ships: player2?.ships, currentPlayerIndex: gameSession?.idPlayer2 });
        respond(ws1, MessageType.start_game, { ships: player1?.ships, currentPlayerIndex: gameSession?.idPlayer1 });

        respond(ws1, MessageType.turn, {
          currentPlayer: gameSession?.idPlayer1,
        });
        respond(ws2, MessageType.turn, {
          currentPlayer: gameSession?.idPlayer1,
        });

        logger(MessageType.start_game, `Player ${setColor(user.name, 'blue')} started a game with a player ${setColor(user2.name, 'blue')}.`);
      }

      const isSinglePlayer = await game.isSinglePlayer(gameId);
      if (isSinglePlayer) {
        const botShips = generateShips();
        const result = await game.addShips(gameId, singlePlayerBotId, botShips);
        if (!!result) {
          respond(ws, MessageType.start_game, { ships: ships, currentPlayerIndex: indexPlayer });
          respond(ws, MessageType.turn, {
            currentPlayer: indexPlayer,
          });
        }
        logger(MessageType.add_ships, `Ships are added for a bot player.`);
        logShips(result as number[][]);
        logger(MessageType.start_game, `Player ${setColor(user.name, 'blue')} started a game with a bot.`);
      }
    }
  } catch (error) {
    logger(MessageType.add_ships, error);
  }
}
