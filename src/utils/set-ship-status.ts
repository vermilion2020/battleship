import { Cell, HitStatus, Ship } from "../repository/game.types";

export const getHitStatus = (x: number, y: number, map: number[][], ships: Ship[]) => {
  const shipCoordinates: Cell[] = [];
  const emptyCells: Cell[] = [];

  ships.forEach((ship) => {
    const xLength = ship.direction ? 1 : ship.length;
    const yLength = ship.direction ? ship.length : 1;

    if (x >= ship.position.x && x < ship.position.x + xLength && y >= ship.position.y && y < ship.position.y + yLength) {
      shipCoordinates
        .push(...new Array(ship.length)
        .fill(0)
        .map((_, i) => ({ x: ship.position.x + (ship.direction ? 0 : i), y: ship.position.y + (ship.direction ? i : 0) })));
      
      for (let i = ship.position.x - 1; i <= ship.position.x + xLength; i++) {
        for(let j = ship.position.y -1; j <= ship.position.y + yLength; j++) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }
  });

  const aliveCell = shipCoordinates.find((cell) => map[cell.x][cell.y] === 1);
  if (aliveCell) return { status: HitStatus.shot };
  
  return { status: HitStatus.killed, restCoordinates: shipCoordinates.filter((cell) => !(cell.x === x && cell.y === y)), emptyCells };
}