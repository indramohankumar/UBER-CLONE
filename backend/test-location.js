const http = require('http');

async function testLocation() {
    console.log("Testing PATCH /drivers/location...\n");
    try {
        const API_URL = "http://localhost:8000";
        
        // 1. Register Driver
        const registerRes = await fetch(`${API_URL}/drivers/register`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullname: { firstname: "Test", lastname: "Driver" },
                email: "driver_loc" + Date.now() + "@example.com",
                password: "password123",
                vehicle: { color: "Blue", plateNumber: "LOC-123", model: "Ford", capacity: 4 },
                location: { latitude: 40.0, longitude: -74.0 }
            })
        });
        const registerData = await registerRes.json();
        const token = registerData.token;

        if (!token) {
            console.error("Failed to register driver:", registerData);
            process.exit(1);
        }

        // 2. Patch Location
        const patchRes = await fetch(`${API_URL}/drivers/location`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
                latitude: 40.7128,
                longitude: -74.0060
            })
        });
        const patchData = await patchRes.json();
        console.log("PATCH Response:", patchData);
        process.exit(0);
    } catch(e) {
        console.error("Test failed with error:", e);
        process.exit(1);
    }
}

try {
    require('./server.js');
    setTimeout(testLocation, 2000);
} catch (e) {
    console.error("Failed to start server:");
    console.error(e);
}
