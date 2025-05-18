import { type WebSocket } from 'ws';

export type User = {
  id: string;
  name: string;
  password: string;
  ws: WebSocket;
  online: boolean;
}

export type Room = {
  id: string;
  idUser1: string;
  idUser2?: string;
}

export type RegisterResponse = {
  id: string | null;
  name: string | null;
  errorMessage: string | null;
}

export type UserDTO = Omit<User, 'id' | 'online'>;

export type Cell = {
  x: number;
  y: number;
}

export enum CellType {
  miss = -2,
  empty = -1,
  ship = 1,
  shot = 2,
}

export enum HitStatus {
  shot = 'shot',
  miss = 'miss',
  killed = 'killed'
}

export type Ship = {
  id: string;
  type: 'small' | "medium" | "large" | "huge";
  direction: boolean;
  length: number;
  position: Cell;
}

export type UserData = {
  ships: Ship[];
  coordinates: number[][];
}
  
export type GameSession = {
  id: string;
  turn: string;
  idPlayer1: string;
  idPlayer2: string;
  playersData: Map<string, UserData>;
}

export type Winner = {
  name: string;
  wins: number;
}
  