import { MessageType } from "./message-types";
import { type WebSocket } from "ws";

export const respond = (ws: WebSocket, type: MessageType, data: any) => {
  const message = {
    type,
    data: JSON.stringify(data),
    id: 0,
  }
  ws.send(JSON.stringify(message));
}