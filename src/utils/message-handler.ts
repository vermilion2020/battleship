import type { RawData, WebSocket } from "ws";
import { getBody } from "./get-body";
import { MessageType } from "./message-types";
import { GameSessionRepository } from "../repository/game-session";
import { register } from "../controller/register";
import { respond } from "./send-response";

export const messageHandler = async (gameSessionRepository: GameSessionRepository, ws: WebSocket, rawMessage: RawData) => {
  const message = getBody(rawMessage);

  try {
    switch (message.type) {
      case MessageType.reg:
        await register(gameSessionRepository, ws, message);
        break;
    }
  } catch (error) {
    respond(ws, MessageType.reg, { error: true, errorText: error });
  }
};
