import { type WebSocket } from "ws";
import { Cell, CellType, HitStatus, Ship } from "../repository/game.types";
import { respond } from "../utils/send-response";
import { MessageType } from "../utils/message-types";
import { getHitStatus } from "../utils/set-ship-status";
import { removeExtraCells } from "../utils/draw-map";

export const handleHit = async (attack: Cell, coordinates: number[][], currentPlayerId: string, ships: Ship[], ws: WebSocket, ws2?: WebSocket) => {
  const isHit = coordinates[attack.x][attack.y] === CellType.ship;
  coordinates[attack.x][attack.y] = isHit ? CellType.shot : CellType.miss;
  
  let status = isHit ? HitStatus.shot : HitStatus.miss;
  if (isHit) {
    const result = getHitStatus(attack.x, attack.y, coordinates, ships);
    status = result.status;

    if (result.emptyCells) {
      // send empty cells around the ship
      removeExtraCells(result.emptyCells).forEach((cell) => {
        const response = {
          position: { x: cell.x, y: cell.y },
          currentPlayer: currentPlayerId,
          status: HitStatus.miss
        };

        if (coordinates[cell.x][cell.y] === CellType.empty) {
          coordinates[cell.x][cell.y] = CellType.miss;
          respond(ws, MessageType.attack, response);
          if (ws2) {
            respond(ws2, MessageType.attack, response);
          }
        }
      });
    }
    if (result.restCoordinates) {
      // update from shot to killed
      result.restCoordinates.forEach((cell) => {
        const response = {
          position: { x: cell.x, y: cell.y },
          currentPlayer: currentPlayerId,
          status: HitStatus.killed
        };
        respond(ws, MessageType.attack, response);
        if (ws2) {
          respond(ws2, MessageType.attack, response);
        }
      });
    }
  }

  return { coordinates, status };
}
