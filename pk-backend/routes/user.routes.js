import { RegisterUser, VerifyOTP, ResendOTP, isAuth ,LogoutUser, UserLogin, verifyForgetPasswordOtp ,forgetPasswordSendOtp } from "../controller/user.controller.js";
import { Router } from "express";
import { protect } from "../middleware/protect.js"; 
const UserRouter = Router();

UserRouter.post("/register", RegisterUser);
UserRouter.post("/verify-otp", VerifyOTP);
UserRouter.post("/resend-otp", ResendOTP);
UserRouter.get("/isAuth",protect,isAuth);
UserRouter.post("/logout",LogoutUser)
UserRouter.post("/login",UserLogin)
 

UserRouter.post("/forget",forgetPasswordSendOtp)
UserRouter.post("/verify-forget-otp",verifyForgetPasswordOtp)

export default UserRouter;