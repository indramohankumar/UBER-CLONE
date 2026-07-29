const crypto = require('crypto');
const axios = require('axios');

async function testWebhook() {
    const secret = "Indramohan@123789"; // Extracted from .env
    const payload = JSON.stringify({
        event: "payment.captured",
        payload: {
            payment: {
                entity: { id: "pay_test_123", amount: 50000, status: "captured" }
            }
        }
    });

    const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    console.log("Generated Signature:", signature);
    console.log("Sending Webhook Request to backend...");

    try {
        const response = await axios.post('http://localhost:8000/payments/webhook', payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-razorpay-signature': signature
            }
        });
        
        console.log("✅ Response Status:", response.status);
        console.log("✅ Response Data:", response.data);
    } catch (error) {
        console.error("❌ Error Status:", error.response?.status);
        console.error("❌ Error Data:", error.response?.data);
        if (!error.response) console.error(error.message);
    }
}

testWebhook();
