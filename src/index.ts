import { WebSocketServer } from 'ws';
import { BASE_PORT } from './utils/consts';
import { messageHandler } from './utils/message-handler';
import 'dotenv/config';
import { GameSessionRepository } from './repository/game-session';
import { setColor } from './utils/logger';

const PORT = +process.env.PORT || BASE_PORT;

const wss = new WebSocketServer({ port: PORT });
const gameSessionRepository = new GameSessionRepository();

wss.on('listening', () => {
  console.log('\nWebSocket Server Parameters:');
  console.log(`Port: ${setColor(PORT.toString(), 'green')}`);
  console.log(`Protocol: ${setColor('ws', 'green')}`);
  console.log(`URL: ${setColor(`ws://localhost:${PORT}`, 'green')}\n`);
});

wss.on('connection', (ws) => {
  ws.on('message', (rawMessage) => {
    messageHandler(gameSessionRepository, ws, rawMessage);
  });

  ws.on('close', () => {
    gameSessionRepository.users.setUserOffline(ws);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

process.on('SIGINT', () => {
  gameSessionRepository.closeConnections();
  wss.close();
});
  
