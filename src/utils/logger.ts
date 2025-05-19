import { EOL } from "node:os";
import { MessageType } from "./message-types";

export const setColor = (text: string, colorName: string) => {
  const colors = {
    red: '31',
    green: '32',
    yellow: '33',
    blue: '34',
    magenta: '35',
    cyan: '36',  
    gray: '90',
  }

  if (!colors[colorName as keyof typeof colors]) {
    return text;
  }

  return `\x1b[${colors[colorName as keyof typeof colors]}m${text}\x1b[0m`;
}

export const logger = (messageType: MessageType, message: string) => {
  console.log(`${setColor(messageType, 'magenta')}: ${message}`);
}

export const logShips = (ships: number[][]) => {
  console.log(`Ships map:`);
  const reordered = ships[0].map((_, colIndex) => 
    ships.map(row => row[colIndex])
  );
  
  for (let i = 0; i < reordered.length; i++) {
    const row = reordered[i].map(cell => cell === 1 ? setColor('X', 'yellow') : setColor('O', 'gray')).join(' ');
    console.log(row);
  }
}
