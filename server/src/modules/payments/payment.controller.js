const asyncHandler =
 require("../../utils/asyncHandler");

const paymentService =
 require("./payment.service");

const createCheckoutSession =
 asyncHandler(
  async (req,res)=>{

   const url =
    await paymentService
     .createCheckoutSession(
       req.body.tierId,
       req.user.id
     );

   return res.status(200).json({
      success:true,
      data:{ url }
   });
 });

module.exports = {
 createCheckoutSession
};