
import { comparepassword, hashpassword } from "./../helpers/authHelper.js";
import Jwt  from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const registercontroller = async(req, res) => {
  try {
         const {name,email,password,phone,address,answer} = req.body
         //validations
         if(!name){
            return res.send({message:'Name is Required'})
         }
         if(!email){
            return res.send({message:'Email is Required'})
         }
         if(!password){
            return res.send({message:'Password is Required'})
         }
         if(!phone){
            return res.send({message:'Phone no is Required'})
         }
         if(!address){
            return res.send({message:'Address is Required'})
         }
         if(!answer){
            return res.send({message:'Answer is Required'})
         }
         //check user
         const exisitingUser = await userModel.findOne({email})

         //exisiting user
         if(exisitingUser){
            return res.status(200).send({
                success:false,
                message:"Already Register please login"
            })
         }
         //register user
         const hashedpassword = await hashpassword(password)
         //save
         const user = await new userModel({name,email,phone,address,password:hashedpassword,answer}).save()

         res.status(201).send({
            success: true,
            massage :"User Register Successfully",
            user,
         })

  } catch (error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error in registeration',
        error
    })
  }
};


//POST LOGIN
export const loginController =async(req,res) => {
   try{
      const {email,password} =req.body
      //validation
      if(!email || !password){
         return res.status(404).send({
            success: false,
            message:'Invalid email or password',
         })
      }
      //check user
      const user = await userModel.findOne({email})
      if(!user){
         return res.status(404).send({
            success:false,
            message:'Email is not registerd'
         })
      }
      const match = await comparepassword(password,user.password)
      if(!match){
         return res.status(200).send({
            success:false,
            message:'Invalid Password'
         })
      }
      //token
      const  token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{
         expiresIn:"7d",
      });
      res.status(200).send({
         success:true,
         message:'login successfully',
         user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role: user.role,
         },
         token,
      });
   } catch (error) {
      console.log(error)
      res.status(500).send({
         success:false,
         message:'Error in login',
         error
      })
   }
};

//forgot password controller

export const forgotPasswordController = async (req,res) => {
   try {
      const {email,answer , newPassword} = req.body
      if(!email){
         res.status(400).send({message:'Email is required'})
      } if(!answer){
         res.status(400).send({message:'answer is required'})
      } if(!newPassword){
         res.status(400).send({message:'New Password is required'})
      }
      //check
      const user = await userModel.findOne({email,answer});
      
      //validation
      if(!user){
         return res.status(400).send({
            success:false,
            message: "Wrong Email or Answer",
         });
      }
      const hashed = await hashpassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, {password: hashed});
      res.status(200).send({
         success:true,
         message:"Password Reset Successfully",
      });
      
   } catch (error) {
      console.log(error)
      res.status(500).send({
         success:false,
         message:'Something Went Wrong',
         error,
      })
      
   }
};

//test controller
export const testController = (req, res) => {
   try{
   res.send("protected Route");
   } catch (error){
      console.log(error);
      res.send({error});
   }

};
//update profile
export const updateProfileController= async(req,res) =>{
   try {
      const {name,email,password,address,phone}= req.body
      const user = await userModel.findById(req.user._id)
      //password
      if(password && password.length < 6){
         return res.json({error:'Password is requires and 6 character long'})
      }
      const hashedpassword = password ? await hashpassword(password) : undefined
      const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
         name:name || user.name,
         password: hashedpassword || user.password,
         phone :phone || user.phone,
         address :address || user.address,
            },{new:true})
            res.status(200).send({
               success:true,
               message:'Profile Updated Successfully',
               updatedUser
            })
   } catch (error) {
      console.log(error)
      res.status(400).send({
         success:false,
         message:'Error While Update profile',
         error
      })
      
   }
}