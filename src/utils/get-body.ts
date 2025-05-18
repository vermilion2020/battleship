import { RawData } from "ws";
import { Message } from "./message-types";
  
export const getBody = (body: RawData): Message | undefined => {
  try {
    const message = JSON.parse(body.toString()) as Message;
    if (message.data) {
      message.data = JSON.parse(message.data);
    }
    return message;
  } catch (error) {
    return undefined;
  }
}