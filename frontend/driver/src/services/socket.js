import { io } from 'socket.io-client';

const socket = io('https://uber-clone-l9xh.onrender.com', {
    autoConnect: false,
    transports: ['websocket']
});

export default socket;
