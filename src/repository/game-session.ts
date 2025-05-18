import { UserRepository } from './user';
import { GameSession, Ship } from './game.types';
import { v4 as uuidv4 } from 'uuid';

export class GameSessionRepository {
  gameSessions: Map<string, GameSession>;
  users: UserRepository;
  winners: Map<string, { name: string, wins: number }> = new Map();
  
  constructor() {
    this.gameSessions = new Map();
    this.users = new UserRepository([]);
  }

  async closeConnections() {
    const wss = await this.users.getActiveWs();
    wss.forEach((ws) => {
      ws.close();
    });
  }
}

