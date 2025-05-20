import { Ship, Cell, ShipType } from "../repository/game.types";
import { getMapTemplate } from "./draw-map";



const TEMPLATE = [
  { type: ShipType.Huge, length: 4 },
  { type: ShipType.Large, length: 3 },
  { type: ShipType.Large, length: 3 },
  { type: ShipType.Medium, length: 2 },
  { type: ShipType.Medium, length: 2 },
  { type: ShipType.Medium, length: 2 },
  { type: ShipType.Small, length: 1 },
  { type: ShipType.Small, length: 1 },
  { type: ShipType.Small, length: 1 },
  { type: ShipType.Small, length: 1 },
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

const placeShip = (ship: { type: ShipType, length: number }, map: number[][]) => {
  const direction = Math.random() > 0.5;
  const { type, length } = ship;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  while (attempts < MAX_ATTEMPTS) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    if (isCellValid(x, y, length, direction, map)) {
      const shipCells: Cell[] = [];
      for (let i = 0; i < length; i++) {
        const cell = { x: x + (direction ? 0 : i), y: y + (direction ? i : 0) };
        map[cell.x][cell.y] = 1;
        shipCells.push(cell);
      }
      return {
        type,
        direction,
        length,
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
