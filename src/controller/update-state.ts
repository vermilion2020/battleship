import { GameSessionRepository } from "../repository/game-session";
import { MessageType } from "../utils/message-types";
import { respond } from "../utils/send-response";

export const updateRoom = async (game: GameSessionRepository) => {
  const wss = await game.users.getActiveWs()
  const availableRooms = await game.users.getAvailableRooms();
  wss.forEach((ws) => {
    respond(ws, MessageType.update_room, availableRooms);
  }); 
}

export const updateWinners = async (game: GameSessionRepository) => {
  const wss = await game.users.getActiveWs()
  const winners = await game.getWinners();
  wss.forEach((ws) => {
    respond(ws, MessageType.update_winners, winners);
  });
}