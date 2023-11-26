import express, {Request, Response,  NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 3000;
const KEY = "this is the key to knowledge";
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
  teacherId: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
  studentsId:[{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]
})

const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const Course = mongoose.model("Course", courseSchema);

mongoose.connect("mongodb://127.0.0.1:27017/gurugDB");

//lets create a middlewear for few routes
const middleAUTH = (req: Request, res: Response, next: NextFunction) =>{
  const authHEAD = req.headers.authorization;
  if(authHEAD){
    const token = authHEAD.split(" ")[1];
    jwt.verify(token, KEY, (err, payload)=>{
      if(err){
        return res.status(403).json({message:"forbidden"})
      }

      if(!payload){
        return res.status(403).json({message:"forbidden"})
      }

      if(typeof(payload)=== 'string'){
        return res.status(403).json({message:"forbidden"})
      }
      
      req.headers["userID"] = payload.id;
      next();
    })
  } else{
    res.status(401).json({message:"authorization failed"})
  }
}



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
      const token = jwt.sign({id: newTeacher._id, role:"teacher"}, KEY, {expiresIn: '2hr'})
      res.status(200).json({message:"user(teacher) signed up successfully", token})
    }
  }else{
    const ans = await Student.findOne({email: email});
    if(ans){
      return res.status(400).json({message:"user already exist"})
    }else{
      const newStudent = new Student({email, password});
      await newStudent.save();
      const token = jwt.sign({id: newStudent._id, role:"student"}, KEY, {expiresIn:'2hr'})
      res.status(200).json({message:"user(student) signed up successfully", token})
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
    const token = jwt.sign({id: ans1._id, role:'teacher'}, KEY, {expiresIn:'2hr'})
    res.status(200).json({message:"teacher logged in successfully", token})
  }else{
    const ans2 = await Student.findOne({email: email});
    if(ans2){
      const token = jwt.sign({id: ans2._id, role:'student'}, KEY, {expiresIn:'2hr'})
      res.status(200).json({message:"student logged in successfully", token})
    }else{
      res.status(400).json({message:"user not found"})
    }
  }
})

//adding the course
app.post("/addCourse/:teacherId", middleAUTH, async(req, res)=>{
  const {title, description, price, imgUrl } = req.body;
  const {teacherId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    return res.status(400).json({ message: "Invalid teacher ID format" });
  }
  const teacher = await Teacher.findById(teacherId);
  if(teacher){
    const newCourse = new Course({title, description, price, imgUrl, teacherId});
    await newCourse.save();
    res.status(200).json({message:"course saved successfully"})
  }else{
    res.status(400).json({message:"the user(teacher) not found"})
  }
})

//updating the course
app.put("/updateCourse/:courseId", middleAUTH, async(req, res)=>{
  const {title, description, price, imgUrl } = req.body;
  const {courseId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID format" });
  }
  const course = await Course.findById(courseId);
  if(course){
    course.title=title;
    course.description=description;
    course.price=price;
    course.imgUrl=imgUrl;
    await course.save();
    res.status(200).json({message:"course updated successfully"});
  }else{
    res.status(400).json({message:"couldn't find the course with given id"})
  }
})

//deleting the course
app.delete("/deleteCourse/:courseId", middleAUTH, async(req, res)=>{
  const {courseId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID format" });
  }
  const deleteCourse = await Course.findByIdAndDelete(courseId);
  if(deleteCourse){
    res.status(200).json({message:"course deleted successfully"})
  }else{
    res.status(400).json({message:"couldn't find the course with given id"})
  }
})


//get all the course
app.get("/courses", middleAUTH, async(req, res)=>{
  const courses = await Course.find();
  res.status(200).json(courses);
})

//get specific course info
app.get("/courses/:courseId", middleAUTH,async(req, res)=>{
  const {courseId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID format" });
  }
  const course = await Course.findById(courseId);
  if(course !== null){
    res.status(200).json(course);
  }else{
    res.status(400).json({message:"couldn't find the course with given id"})
  }
})


//get all teachers
app.get("/teachers", middleAUTH,  async(req, res)=>{
  const teachers = await Teacher.find();
  res.status(200).json(teachers);
})

app.listen(PORT, ()=>console.log(`app is listening at port ${PORT}`));


