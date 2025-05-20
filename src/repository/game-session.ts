import { UserRepository } from './user';
import { GameSession, Ship } from './game.types';
import { drawMap } from '../utils/draw-map';
import { v4 as uuidv4 } from 'uuid';

export const singlePlayerBotId = 'singlePlayerBot';

export class GameSessionRepository {
  gameSessions: Map<string, GameSession>;
  users: UserRepository;
  winners: Map<string, { name: string, wins: number }> = new Map();
  
  constructor() {
    this.gameSessions = new Map();
    this.users = new UserRepository([]);
  }

  async addGameSession(idPlayer1: string, idPlayer2: string) {
    const session = {
      id: uuidv4(),
      idPlayer1,
      idPlayer2,
      turn: idPlayer1,
      playersData: new Map([
        [idPlayer1, { ships: [] as Ship[], coordinates: [] as number[][] }],
        [idPlayer2, { ships: [] as Ship[], coordinates: [] as number[][] }]
      ]),
    }
    this.gameSessions.set(session.id, session);
    return session;
  }

  async updateCoordinates(idGame: string, idPlayer: string, coordinates: number[][]) {
    const session = this.gameSessions.get(idGame);
    if (!session) {
      return;
    }
    const player = session.playersData.get(idPlayer);
    const updatedPlayer = { ...player, coordinates };
    session.playersData.set(idPlayer, updatedPlayer);
  }

  async setTurn(idGame: string, idPlayer: string) {
    const session = this.gameSessions.get(idGame);
    if (!session) {
      return;
    }
    session.turn = idPlayer;
    this.gameSessions.set(idGame, session);
  }

  async getPlayerData(idGame: string, idPlayer: string) {
    const session = this.gameSessions.get(idGame);
    if (!session) {
      return null;
    }
    return session.playersData.get(idPlayer);
  }

  async getGameSession(idGame: string) {
    return this.gameSessions.get(idGame);
  }

  async addShips(idGame: string, idPlayer: string, ships: Ship[]) {
    const session = this.gameSessions.get(idGame);
    if (!session) {
      return false;
    }
    const player = session.playersData.get(idPlayer);

    if (!player) {
      return false;
    }
    player.ships = [...ships];
    player.coordinates = drawMap(ships);
    session.playersData.set(idPlayer, player);
    this.gameSessions.set(idGame, session);
    return player.coordinates;
  }

  async checkGameSessionReady(idGame: string) {
    const session = this.gameSessions.get(idGame);

    if (!session || session.idPlayer2 === singlePlayerBotId) {
      return false;
    }

    const players = Array.from(session.playersData.values());
    if (players.find(player => player.ships.length === 0)) {
      return false;
    }

    return true;
  }

  async isSinglePlayer(idGame: string) {
    const session = this.gameSessions.get(idGame);

    if (!session) {
      return false;
    }

    if (!!session.idPlayer1 && session.idPlayer2 === singlePlayerBotId) {
      return true;
    }

    return false;
  }

  async setWinner(idPlayer: string) {
    const winnerState = this.winners.get(idPlayer);

    if (winnerState) {
      winnerState.wins += 1;
      this.winners.set(idPlayer, winnerState);
    } else {
      const userData = await this.users.getUserById(idPlayer);
      this.winners.set(idPlayer, { name: userData.name, wins: 1 });
    }
  }

  async getWinners() {
    return Array.from(this.winners.values());
  }

  async getWinnerById(id: string) {
    return this.winners.get(id);
  }

  async closeConnections() {
    const wss = await this.users.getActiveWs();
    wss.forEach((ws) => {
      ws.close();
    });
  }
}

