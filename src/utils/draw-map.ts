import { Cell, CellType, Ship } from "../repository/game.types";

const getMapTemplate = () => {
  return new Array(10).fill(1).map(() => new Array(10).fill(CellType.empty));
}
  
export const drawMap = (ships: Ship[]) => {
  const map = getMapTemplate();
  ships.forEach(ship => {
    const { position: { x, y }, direction, length } = ship;
    for (let i = 0; i < length; i++) {
      if (direction) {
        map[x][y + i] = CellType.ship;
      } else {
        map[x + i][y] = CellType.ship;
      }
    }
  })
  return map;
}

export const removeExtraCells = (emptyCells: Cell[]) => {
  return emptyCells
    .filter((cell) => cell.x >= 0 && cell.x <= 9 && cell.y >= 0 && cell.y <= 9)
    .map((cell) => ({ x: cell.x, y: cell.y }));
}
