import { v4 as uuidv4 } from 'uuid';
import { type WebSocket } from 'ws';
import { RegisterResponse, Room, User, UserDTO } from './game.types';

export class UserRepository {
  users: User[];
  rooms: Room[];

  constructor(users: User[]) {
    this.users = users;
    this.rooms = [];
  }

  getUser(ws: WebSocket) {
    return this.users.find(user => user.ws === ws);
  }

  getUserById(id: string) {
    return this.users.find(user => user.id === id);
  }

  setUserOffline(ws: WebSocket) {
    const userIndex = this.users.findIndex(user => user.ws === ws);
    if (userIndex === -1) {
      return;
    }
    this.users[userIndex].online = false;
  }

  async getActiveWs() {
    return this.users.filter(user => user.ws && user.online).map(user => user.ws);
  }

  async addUser(userDTO: UserDTO) {
    const newUser = {
      ...userDTO,
      id: uuidv4(),
      online: true,
    }
    this.users.push(newUser);
    return newUser;
  }

  async registerConnection(name: string, password: string, ws: WebSocket): Promise<RegisterResponse> {
    const userIndex = this.users.findIndex(user => user.name === name);
    let user = this.users[userIndex];
    if (userIndex === -1) {
      user = await this.addUser({ name, password, ws });
      return { id: user.id, name: user.name, errorMessage: null };
    }
    if (user.password !== password) {
      return { id: null, name: null, errorMessage: `This password is incorrect for specified user name: ${name}` };
    }
    user.ws = ws;
    user.online = true;
    this.users[userIndex] = user;
    return { id: user.id, name: user.name, errorMessage: null };
  }

  async addRoom(userId?: string) {
    const newRoom = {
      id: uuidv4(),
      ...(userId && { idUser1: userId }),
    }
    this.rooms.push(newRoom);
    return newRoom;
  }

  async addUserToRoom(roomId: string, idUser: string) {
    const room = this.rooms.find(room => room.id === roomId);
    if (!room) {
      return false;
    }
    if (room.idUser1 && room.idUser2) {
      return false;
    }
    if (!room.idUser1) {
      room.idUser1 = idUser;
    } else if (room.idUser1 === idUser) {
      return false;
    } else {
      room.idUser2 = idUser;
    }
    return room;
  }

  async getRoom(id: string) {
    return this.rooms.find(room => room.idUser1 === id || room.idUser2 === id);
  }

  async getAvailableRooms() {
    const rooms = this.rooms.filter(room => !room.idUser2 || !room.idUser1);
    const roomsData = rooms.map(room => ({
      roomId: room.id,
      roomUsers: [{
        index: room.idUser1,
        name: this.getUserById(room.idUser1)?.name }]
      }));
    return roomsData;
  }
}

