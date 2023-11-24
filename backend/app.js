const express = require('express');
const mongoose= require('mongoose');


const app = express();
const PORT = 3000;
app.use(express.json());



const teacherSchema = new mongoose.Schema({
  name: String,
  email:String,
  password: String,
  subject: String,
  experience: Number,
  imgUrl: String,
  coureseMADE:[{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
})

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  courseSUB:[{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imgUrl: String,
  teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
  students:[{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]
})

const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const Course = mongoose.model("Course", courseSchema);

mongoose.connect("mongodb://127.0.0.1:27017/gurugDB");



//general sign up route
app.post("/signup", async(req, res)=>{
  const {email, password, isTeacher} = req.body;
  console.log(isTeacher);
  if(isTeacher){
    const ans = await Teacher.findOne({email: email});
    if(ans){
      return res.status(400).json({message:"user already exist"})
    }else{
      const newTeacher = new Teacher({email, password});
      await newTeacher.save();
      res.status(200).json({message:"user(teacher) signed up successfully"})
    }
  }else{
    const ans = await Student.findOne({email: email});
    if(ans){
      return res.status(400).json({message:"user already exist"})
    }else{
      const newStudent = new Student({email, password});
      await newStudent.save();
      res.status(200).json({message:"user(student) signed up successfully"})
    }
  }
})

//route to set up profile student
app.post("/signup/profileStudent", async(req, res)=>{
  const { email, name} = req.body;
  const student = await Student.findOne({email: email});
  if(student){
    student.name=name;
    await student.save()
    res.status(200).json({message:"profile set up successfully"})
  }else{
    res.status(400).json({message:"user not found"})
  }
})


//route to setup the teacher profile
app.post("/signup/profileTeacher", async(req, res)=>{
  const{email, name, subject, experience, imgUrl}= req.body;
  const teacher = await Teacher.findOne({email: email})
  if(teacher){
    teacher.name=name;
    teacher.subject=subject;
    teacher.experience=experience;
    teacher.imgUrl=imgUrl;
    await teacher.save()
    res.status(200).json({message:"profile set up successfully"})
  }else{
    res.status(400).json({message:"user not found"})
  }
})

//log in route
app.post("/login", async(req, res)=>{
  const{email, password}= req.body;
  const ans1 = await Teacher.findOne({email: email});
  if(ans1){
    res.status(200).json({message:"teacher logged in successfully"})
  }else{
    const ans2 = await Student.findOne({email: email});
    if(ans2){
      res.status(200).json({message:"student logged in successfully"})
    }else{
      res.status(400).json({message:"user not found"})
    }
  }
})



app.listen(PORT, ()=>console.log(`app is listening at port ${PORT}`));


