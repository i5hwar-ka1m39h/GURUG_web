const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

//the key to site
const KEY = "this_is_the_key";

//define schema
const studentSchema = new mongoose.Schema({
  userName: String,
  password: String,
  purchasedCourses: [{type: mongoose.Types.ObjectId, ref: 'Course'}]
})

const adminSchema = new mongoose.Schema({
  userName: String,
  password: String,
  publishedCourses: [{type: mongoose.Types.ObjectId, ref:'Course'}]
})

const courseSchema = new mongoose.Schema({
  title: String, 
  description: String,
  price: Number,
  imageUrl: String,
  authorId: { type: mongoose.Types.ObjectId, ref: 'User' },
  isPublished: Boolean
})

//define model
const Student = mongoose.model("Student",studentSchema);
const Admin = mongoose.model("Admin",adminSchema)
const Course = mongoose.model("Course",courseSchema)

//authorization 
const handleToken = (req, res, next)=>{
  const authHead = req.headers.authorization;
  //if authHead then this code
  if(authHead){
    //split the token from bearer
    const token = authHead.split(" ")[1];
    jwt.verify(token, KEY, (err, user)=>{
      if(err){
        return res.sendStatus(403); //understand the request but won't give a shit
      }
      req.user = user;
      next();
    })
  }
  //if not authHead this send 401:unathorized
  else{
    return res.sendStatus(401);
  }
}


//connecting to the db
mongoose.connect("mongodb://127.0.0.1:27017/gurugDB", {dbName: "gugugDB"});

//home page
app.get("/home", (req, res)=>{
  res.send("this is home page!!!");
})

///////////////////////
/////admin routes/////
/////////////////////

//admin signup
app.post("/admin/signup", async(req, res)=>{
  const{userName, password} = req.body;
  const returnedUser = await Admin.find({userName:userName})

  if(returnedUser){
    return res.status(500).json({message:"username already exist!"})
  }else{
    let newAdmin = new Admin({userName:userName, password:password})
    newAdmin.save();
    const token = jwt.sign({userName, role: 'admin'}, KEY, {expiresIn: '1hr'});
    res.json({message:"admin saved successfully"});
  }
})

//admin login
app.post("/admin/login", async(req, res)=>{
  const {userName, password} = req.body;
  const adminFind = await Admin.findOne({userName, password});
  if(adminFind){
    const token = jwt.sign({userName, role: 'admin'}, KEY, {expiresIn: '1hr'});
    res.json({message:"logged in successfully", token})
  }else{
    res.status(401).json({message:'wrong username or password!'});
  }
})

//admin course add
app.post("/admin/course", handleToken, async(req, res)=>{
  const course = new Course(req.body);
  await course.save();
  res.json({message:"course added successfully"});
})

//admin show course
app.get("/admin/courses", handleToken, async(req, res)=>{
   const courses = await Course.find({});
   res.json({courses});
})

//admin update course
app.put("/admin/course/:courseId", handleToken, async(req, res)=>{
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body);
  if(course){
    res.json({message:"updated successfully"});
  }else{
    res.status(404).json({message:"not found"});
  }
})

//////////////////////////////
////// student routes ///////
////////////////////////////

//student sign up
app.post("/student/signup", async(req, res)=>{
  const{userName, password} = req.body;
  const returnedUser = await Student.find({userName:userName})

  if(returnedUser){
    return res.status(500).json({message:"username already exist!"})
  }else{
    let newStudent = new Student({userName:userName, password:password})
    newStudent.save();
    const token = jwt.sign({userName, role: 'student'}, KEY, {expiresIn: '1hr'});
    res.json({message:"student saved successfully"});
  }
})

//student login
app.post("/student/login", async(req, res)=>{
  const{userName, password} = req.body;
  const user = await Student.findOne({userName:userName});
  if(user){
    
  }

})




app.listen(3000, ()=>console.log("app is listening at port 3000"))