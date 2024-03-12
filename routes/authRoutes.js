import Express  from "express";
import {
    registercontroller, 
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController
} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
//router object
const router = Express.Router();


//routing
//register || method post
router.post('/register', registercontroller);

//LOGIN || POST 
router.post('/login', loginController);

//Forgot password || POST
router.post("/forgot-password",forgotPasswordController);

//test routes
router.get('/test',requireSignIn, isAdmin, testController);

//protected user route auth
router.get("/user-auth", requireSignIn,(req,res) =>{
    res.status(200).send({ ok: true});
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn,isAdmin,(req,res) =>{
    res.status(200).send({ ok: true});
});

//update profile
router.put('/profile', requireSignIn, updateProfileController)

export default router;