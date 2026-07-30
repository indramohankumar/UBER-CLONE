import { io } from 'socket.io-client';

const socket = io('https://uber-clone-l9xh.onrender.com', {
    autoConnect: false,
});

export default socket;
