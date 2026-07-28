const paymentService=require('../services/payment.service');
const createOrder=async(req,res)=>{
    try{
        const {amount}=req.body;
        if(!amount){
            return res.status(400).json({
                success:false,
                message:"Amount is required"
            });

        }
        const order=await paymentService.createOrder(amount);
        return res.status(201).json(order);
    }catch(error){
        console.error("Error creating order:",error);
        return res.status(500).json({
            success:false,
            message:"Failed to create order"
        });
    }
};
const verifyPayment=async(req,res)=>{
    try{
        const{
razorpay_order_id,
razorpay_payment_id,
razorpay_signature
        }=req.body;
        const isValid=paymentService.verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );
        if(!isValid){
            return res.status(400).json({
                success:false,
                message:"Invalid payment signature"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Payment verified successfully"
        });
    }catch(error){
        console.error("Error verifying payment:",error);
        return res.status(500).json({
            success:false,
            message:"Failed to verify payment"
        });
    }
    }
module.exports={
    createOrder,
    verifyPayment
}