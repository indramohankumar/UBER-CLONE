const axios = require('axios');
axios.post('http://localhost:8000/payments/verify', {}).catch(err => {
    console.log(err.response?.status);
    console.log(err.response?.data);
});
