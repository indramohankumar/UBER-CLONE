import axios from 'axios';

const api = axios.create({
    baseURL: 'https://uber-clone-l9xh.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
