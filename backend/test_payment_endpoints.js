const axios = require('axios');

async function testBackend() {
    try {
        console.log("Testing create-order...");
        const res = await axios.post('http://localhost:8000/payments/create-order', { amount: 500 });
        console.log("Order created:", res.data);

        console.log("Testing verify (with fake data to trigger verification failure, not crash)...");
        try {
            await axios.post('http://localhost:8000/payments/verify', {
                razorpay_order_id: res.data.id,
                razorpay_payment_id: "fake_payment",
                razorpay_signature: "fake_sig"
            });
        } catch (verifyError) {
            console.log("Verify error status:", verifyError.response?.status);
            console.log("Verify error message:", verifyError.response?.data?.message);
        }
    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

testBackend();
