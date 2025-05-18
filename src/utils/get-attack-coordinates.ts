import { CellType } from "../repository/game.types";
import { Message, MessageType } from "./message-types";

export const getAttackCoordinates = (message: Message, coordinates: number[][], botTurn = false) => {
  let x;
  let y;

  if (message.type === MessageType.attack && !botTurn) {
    x = message.data.x;
    y = message.data.y;
  } else {
    let randomPosition;
    for (let i = 0; i <= 9; i++) {
      for (let j = 0; j <= 9; j++) {
        if (coordinates[j][i] === CellType.ship || coordinates[j][i] === CellType.empty) {
          if (!randomPosition) randomPosition = { x: j, y: i };
          break;
        }
      }
    }
    x = randomPosition.x;
    y = randomPosition.y;
  }

  return { x, y };
}
