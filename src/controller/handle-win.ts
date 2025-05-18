import { GameSessionRepository } from "../repository/game-session";
import { CellType } from "../repository/game.types";
import { MessageType } from "../utils/message-types";
import { respond } from "../utils/send-response";
import { type WebSocket } from "ws";
import { updateWinners } from "./update-state";

export const handleWin = async (game: GameSessionRepository, coordinates: number[][], currentPlayerId: string, ws: WebSocket, ws2?: WebSocket) => {
  const mapStat = coordinates.flat(2).findIndex(cell => cell === CellType.ship);
  if (mapStat === -1) {
    await game.setWinner(currentPlayerId);
    const response = { winPlayer: currentPlayerId };
    respond(ws, MessageType.finish, response);
    if (ws2) {
      respond(ws2, MessageType.finish, response);
    }
    await updateWinners(game);
    return true;
  }
  return false;
}
