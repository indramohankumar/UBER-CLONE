const razorpay =require('../config/razorpay');
const crypto=require('crypto');
const createOrder=async(amount)=>{
    const options={
        amount:amount*100,
        currency:"INR",
        receipt:`receipt_${Date.now()}`
    };
    const order=await razorpay.orders.create(options);
    return order;
}
const verifyPayment=(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
)=>{
    const generatedSignature=crypto
    .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
    return generatedSignature===razorpay_signature;
};
module.exports={
    createOrder,
    verifyPayment
}