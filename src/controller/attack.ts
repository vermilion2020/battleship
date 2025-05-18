import { GameSessionRepository, singlePlayerBotId } from "../repository/game-session";
import { Message, MessageType } from "../utils/message-types";
import { respond } from "../utils/send-response";
import { type WebSocket } from "ws";
import { nextTurn } from "./next-turn";
import { CellType } from "../repository/game.types";
import { getAttackCoordinates } from "../utils/get-attack-coordinates";
import { handleHit } from "./handle-hit";
import { handleWin } from "./handle-win";

export const attack = async (game: GameSessionRepository, ws: WebSocket, message: Message) => {
  const { gameId, indexPlayer } = message.data;
  let ws2: WebSocket | undefined;

  const isSinglePlayer = await game.isSinglePlayer(gameId);

  const gameSession = await game.getGameSession(gameId);

  if (!gameSession) {
    return;
  }

  if (gameSession.turn !== indexPlayer) {
    return;
  }

  const idPlayer2 = gameSession.idPlayer1 === indexPlayer ? gameSession.idPlayer2 : gameSession.idPlayer1;

  const player2 = gameSession.playersData.get(idPlayer2);
  if (!isSinglePlayer) {
    ws2 = game.users.getUserById(idPlayer2)?.ws;
  }

  const coordinates = player2?.coordinates;

  if (!coordinates) {
    return;
  }
  
  const { x, y } = getAttackCoordinates(message, coordinates);
  
  const isHit = coordinates[x][y] === CellType.ship;
  if ((coordinates[x][y] === CellType.shot || coordinates[x][y] === CellType.miss) && !isSinglePlayer) {
    return await nextTurn(gameId, idPlayer2, game, ws, ws2);
  }

  const result = await handleHit({ x, y }, coordinates, indexPlayer, player2.ships, ws, ws2);
  await game.updateCoordinates(gameId, idPlayer2, result.coordinates);

  const isWin = await handleWin(game, coordinates, indexPlayer, ws, ws2);
  if (isWin) {
    return;
  }

  const response = {
    position: { x, y },
    currentPlayer: indexPlayer,
    status: result.status
  }

  respond(ws, MessageType.attack, response);
  if (ws2) {
    respond(ws2, MessageType.attack, response);
  }

  if (!isSinglePlayer || isHit) {
    const nextPlayerId = isHit ? indexPlayer : idPlayer2;
    return await nextTurn(gameId, nextPlayerId, game, ws, ws2);
  } else {
    let continueAttack = true;
    while (continueAttack) {
      const player1 = gameSession.playersData.get(indexPlayer);
      const coordinates = player1.coordinates;
      const { x, y } = getAttackCoordinates(message, coordinates, true);

      if (coordinates[x][y] === CellType.empty) continueAttack = false;
      const result = await handleHit({ x, y }, coordinates, singlePlayerBotId, player1.ships, ws);
      await game.updateCoordinates(gameId, indexPlayer, result.coordinates);

    const response = {
      position: { x, y },
      currentPlayer: singlePlayerBotId,
      status: result.status
    }
  
    respond(ws, MessageType.attack, response);

    const isWin = await handleWin(game, coordinates, singlePlayerBotId, ws);
      if (isWin) {
        continueAttack = false;
        return;
      }
    }
    return await nextTurn(gameId, indexPlayer, game, ws);
  }
}
