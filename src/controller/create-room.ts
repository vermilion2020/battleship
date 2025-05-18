import { GameSessionRepository } from "../repository/game-session";
import { updateRoom } from "./update-state";
import { type WebSocket } from "ws";

export const createRoom = async (game: GameSessionRepository, ws: WebSocket) => {
  const userId = game.users.getUser(ws)?.id;
  const room = await game.users.addRoom(userId);
  if (room) {
    await updateRoom(game);
  }
}
