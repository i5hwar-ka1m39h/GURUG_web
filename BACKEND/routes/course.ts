import express from 'express';
const router = express.Router();
import {handleToken} from '../middleware';
import { Course} from '../db';



//admin course add
router.post("/admin/course", handleToken, async(req, res)=>{
  const course = new Course(req.body);
  await course.save();
  res.json({message:"course added successfully"});
})

//admin show course
router.get("/admin/courses", handleToken, async(req, res)=>{
   const courses = await Course.find({});
   res.json({courses});
})

//admin update course
router.put("/admin/course/:courseId", handleToken, async(req, res)=>{
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body);
  if(course){
    res.json({message:"updated successfully"});
  }else{
    res.status(404).json({message:"not found"});
  }
})

//get courses in which student have enrolled
router.get("/student/course", async(req, res)=>{
  const course = await Course.find({});
  res.json({course});
});

export default router;