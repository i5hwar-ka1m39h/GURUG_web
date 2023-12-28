import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());

const SECRET = "secret";


const teacherSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  courseCreated: [{type:mongoose.Schema.Types.ObjectId, ref:'Course'}]
})

const studentSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  courseSubscribed:[{type:mongoose.Schema.Types.ObjectId, ref:'Course'}]
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  isPublished: Boolean,
  imgUrl: String,
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
  studentSubscribers: [{type:mongoose.Schema.Types.ObjectId, ref: 'Student'}]
})

const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const Course =  mongoose.model("Course", courseSchema);


mongoose.connect('mongodb://127.0.0.1:27017/gurugDB');



export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (!payload) {
        return res.sendStatus(403);
      }
      if (typeof payload === "string") {
        return res.sendStatus(403);
      }
      
      req.headers["userId"] = payload.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

//hash generator 
const hashGenerate = async(password:string)=>{
  let saltRound = 10;
  const hashedPass = await bcrypt.hash(password, saltRound);
  return hashedPass;
}

const comparePassword = async(password: string, hash: string)=>{
  const result = await bcrypt.compare(password, hash);
  return result;
}


app.post("/signup", async(req, res)=>{
  const{email, password, isTeacher} = req.body;
  try {
    if(isTeacher){
      const teacher = await Teacher.findOne({email: email});
      if(teacher){
        return res.status(409).json({message:"User already exists"})
      }else{
        const hasH = await hashGenerate(password);
        const newTeacher = new Teacher({email: email, password: hasH})
        await newTeacher.save();
        const token = jwt.sign({ id: newTeacher._id, role: 'Teacher' }, SECRET, { expiresIn: '24h' });
        res.status(200).json({message: "Teacher saved successfully", token})
      }
    }else{
      const student = await Student.findOne({email: email});
      if(student){
        return res.status(409).json({message:"User already exists"})
      }else{
        const hasH = await hashGenerate(password);
        const newStudent = new Student({email: email, password: hasH})
        await newStudent.save();
        const token = jwt.sign({ id: newStudent._id, role: 'Student' }, SECRET, { expiresIn: '24h' });
        res.status(200).json({message: "Student saved successfully", token})
      }
    }

  } catch (error) {
    console.error(error);
    res.status(501).json({message:"internal error ", error})
  }
})



app.post("/login", authenticateJwt, async(req, res)=>{
  const { email, password } = req.body;

  try {
    const user = await Teacher.findOne({email});

    if(user){
      //@ts-ignore
      const isPasswordValid = await comparePassword(password, user.password);
      if(isPasswordValid){
        const token = jwt.sign({id: user._id, role: 'Teacher'}, SECRET, {expiresIn:'24hr'})
        res.status(200).json({message:'teacher logged in successfully',token})
      }else{
        res.status(401).json({error:'invalid password'});
      }
    }
    
    else{
      const student = await Student.findOne({email});
      if(student){
        //@ts-ignore
        const isPasswordValid = await comparePassword(password, student.password);
        if(isPasswordValid){
          const token = jwt.sign({id: student._id, role: 'Student'}, SECRET, {expiresIn:'24hr'})
          res.status(200).json({message:'student logged in successfully',token})
        }else{
          res.status(401).json({error:'Invalid login credentials'});
        }
      }else{
        res.status(404).json({error:'user not found'})
      }
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({message:"internal error", error})
  }
})



app.listen(3000, ()=>{console.log('listening at port 3000')
})