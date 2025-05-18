import { Ship, Cell } from "../repository/game.types";
import { getMapTemplate } from "./draw-map";

const TEMPLATE = [
  { type: 'huge', lenght: 4 },
  { type: 'large', lenght: 3 },
  { type: 'large', lenght: 3 },
  { type: 'medium', lenght: 2 },
  { type: 'medium', lenght: 2 },
  { type: 'medium', lenght: 2 },
  { type: 'small', lenght: 1 },
  { type: 'small', lenght: 1 },
  { type: 'small', lenght: 1 },
  { type: 'small', lenght: 1 },
]

const isCellValid = (x: number, y: number, length: number, direction: boolean, map: number[][]) => {
  if (direction) {
    if (y + length > 10) return false;
    for (let i = Math.max(0, x - 1); i <= Math.min(9, x + 1); i++) {
      for (let j = Math.max(0, y - 1); j <= Math.min(9, y + length); j++) {
        if (map[i][j] === 1) return false;
      }
    }
  } else {
    if (x + length > 10) return false;
    for (let i = Math.max(0, x - 1); i <= Math.min(9, x + length); i++) {
      for (let j = Math.max(0, y - 1); j <= Math.min(9, y + 1); j++) {
        if (map[i][j] === 1) return false;
      }
    }
  }
  return true;
}

const placeShip = (ship: { type: string, lenght: number }, map: number[][]) => {
  const direction = Math.random() > 0.5;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    if (isCellValid(x, y, ship.lenght, direction, map)) {
      const shipCells: Cell[] = [];
      for (let i = 0; i < ship.lenght; i++) {
        if (direction) {
          map[x][y + i] = 1;
          shipCells.push({ x, y: y + i });
        } else {
          map[x + i][y] = 1;
          shipCells.push({ x: x + i, y });
        }
      }
      return {
        type: ship.type as 'small' | 'medium' | 'large' | 'huge',
        direction,
        length: ship.lenght,
        position: { x, y }
      };
    }
    attempts++;
  }
  return null;
}

export const generateShips = (): Ship[] => {
  const map = getMapTemplate();
  const ships: Ship[] = [];

  for (const ship of TEMPLATE) {
    const placedShip = placeShip(ship, map);
    if (!placedShip) {
      return generateShips();
    }
    ships.push(placedShip);
  }

  return ships;
}
