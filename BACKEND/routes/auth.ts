import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import {Admin, Student} from '../db';
import {KEY} from '../middleware';


//admin signup
router.post("/admin/signup", async(req, res)=>{
  const{userName, password} = req.body;
  const returnedUser = await Admin.find({userName:userName})
  
  if(returnedUser.length > 0){
    return res.status(500).json({message:"username already exist!" })
    
  }else{
    let newAdmin = new Admin({userName:userName, password:password})
    newAdmin.save();
    const token = jwt.sign({id: newAdmin._id, role: 'admin'}, KEY, {expiresIn: '1hr'});
    res.json({message:"admin saved successfully", token});
  }
})

//admin login
router.post("/admin/login", async(req, res)=>{
  const {userName, password} = req.body;
  const adminFind = await Admin.findOne({userName, password});
  if(adminFind){
    const token = jwt.sign({id: adminFind._id, role: 'admin'}, KEY, {expiresIn: '1hr'});
    res.json({message:"logged in successfully", token})
  }else{
    res.status(401).json({message:'wrong username or password!'});
  }
})


//student sign up
router.post("/student/signup", async(req, res)=>{
  const{userName, password} = req.body;
  const returnedUser = await Student.find({userName:userName})

  if(returnedUser){
    return res.status(500).json({message:"username already exist!"})
  }else{
    let newStudent = new Student({userName:userName, password:password})
    newStudent.save();
    const token = jwt.sign({id: newStudent._id, role: 'student'}, KEY, {expiresIn: '1hr'});
    res.json({message:"student saved successfully", token});
  }
})

//student login
router.post("/student/login", async(req, res)=>{
  const{userName, password} = req.body;
  const user = await Student.findOne({userName:userName});
  if(user){
    const token = jwt.sign({id:user._id, role: 'student'}, KEY, {expiresIn: '1hr'});
    res.status(200).json({message:"logged in successfully", token})
  }else{
    res.status(403).json({message:"invalid username or password"});
  }
})


export default router;

