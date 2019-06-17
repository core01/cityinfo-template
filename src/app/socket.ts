import * as openSocket from 'socket.io-client';
import * as dotenv from 'dotenv';

dotenv.config();

const socket = openSocket(process.env.SOCKET_URL);

function subscribeToTimer(cb: Function) {
  socket.on('timer', (timestamp: number) => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

export { subscribeToTimer };
