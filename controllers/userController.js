import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken=(userId)=>{
    const token=jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
    return token;
}

//post/api/user/register
export const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        //check if required fields are missing
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        //check if user already exists
        const user=await User.findOne({email});
        if(user){
            return res.status(409).json({message:"User already exists"});
        }

        //create new user
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User.create({
            name,email,password:hashedPassword
        })

        //return success response
        const token=generateToken(newUser._id);
        newUser.password=undefined; //hide password
        return res.status(201).json({message:"User registered successfully",user:newUser,token});
    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

//controller for user login
//post/api/user/login
export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;

        
        //check if user already exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(409).json({message:"User does not exist"});
        }

        //check password
        if(!user.comparePassword(password)){
            return res.status(401).json({message:"Invalid credentials"});
        }

        //return success response
        const token=generateToken(user._id);
        user.password=undefined; //hide password
        return res.status(200).json({message:"User login successfully",user,token});
    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

//controller for getting user details
//get/api/user/:id
export const getUserById=async(req,res)=>{
    try{
        const userId=req.userId;

        //check if user exists
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        //return user
        user.password=undefined; //hide password
        return res.status(200).json({user});
    }
    catch(error){
        return res.status(400).json({message:error.message});
    }
}

//controller for getting user resumes
//GET:/api/users/resumes

export const getUserResumes=async(req,res)=>{
    try{
        const userId=req.userId;

        //return user resumes
        const resumes=await Resume.find({userId});
        return res.status(200).json({resumes});
    }
    catch(error){
        return res.status(400).json({message:error.message});
    }
}