import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose,{Schema} from 'mongoose';
import cors from 'cors'
import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from "express";
const SECRET = "secret"


const app = express();

app.use(express.json());
app.use(cors())


//connect to database
mongoose.connect('mongodb://localhost:27017/gurug');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    userName: String,
    isTeacher: Boolean,
    courseSubscribed: [{type: Schema.Types.ObjectId, ref:'Course'}],
    courseCreated:[{type: Schema.Types.ObjectId, ref: 'Course'}]
})

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail:String,
    videoUrl:String,
    createdBy: { type : Schema.Types.ObjectId ,ref : 'User'},
    students: [ {type: Schema.Types.ObjectId, ref: 'User'}]
})

const User = mongoose.model( "User", userSchema)
const Course = mongoose.model("Course", courseSchema);

const saltRound = 10;

const hashingPass = async(password:string)=>{
    try {
        const hash= await bcrypt.hash(password,saltRound)
        return hash;
    } catch (error) {
        console.error("from hash generation",error);
    }
}

const compareHash = async(plainPassword:string, hash: string)=>{
    try {
        const result = await bcrypt.compare(plainPassword, hash);
        return result
    } catch (error) {
        console.error("from hash comparison",error);
    }
}

const authUserJWT = (req: Request, res: Response, next: NextFunction)=>{
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
      
      req.headers["id"] = payload.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

//find email
const findUser = async(email:string)=>{
    const user = await User.findOne({email})
    return user
}

//signUP
app.post("/signup", async(req:Request, res:Response)=>{
    const {email, password} = req.body;
    const user = await findUser(email);
    if(user){
        return res.status(409).json({message:"Email already in use"});
    }else{
        const hashPass = await hashingPass(password);
        const newUser = new User({email: email , password :hashPass});
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, "secret", {expiresIn: '24hr'})
        res.json({ message: 'User created successfully', token });
    }
})

//login
app.post("/login", async(req:Request, res:Response)=>{
    const {email, password} = req.body;
    const user = await findUser(email)
    if(!user){
        return  res.status(401).json({message:'email does not exist in databasr'})
    }else{
        //@ts-ignore
        const isValidPassword = await compareHash(password, user.password)
        if(isValidPassword){
            const token = jwt.sign({id: user._id}, "secret", {expiresIn: '24hr'})
            res.json({ message: 'Logged in successfully', token });
        }else{
            res.status(401).json('Invalid Password')
        }
    }
})

//create course
app.post("/createCouse", authUserJWT, async(req:Request, res: Response)=>{
    const course = new Course(req.body);
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course._id });
})

//update course
app.put("/updateCourse/:courseId", authUserJWT, async(req:Request, res: Response)=>{
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {new: true});
    if (!course){
        return res.status(404).send("No course with that")
    } else{
        res.json({message:"course updated successfully", course})
    }
})

//delete course
app.delete("/deleteCourse/:courseId", authUserJWT, async(req:Request, res: Response)=>{
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course){
        return res.status(404).send("No course with that id")
    } else{
        res.json({message:"course deleted successfully"})
    }
})

//get all the course
app.get("/courses", async(req:Request, res: Response)=>{
    const courses = await Course.find({});
    res.json({ courses });
} )

//updateprofile
app.put("/updateProfile/userId", authUserJWT, async(req:Request, res: Response)=>{
    const user = await User.findByIdAndUpdate(req.params.userId, req.body);
    if (!user){
        return res.status(404).send("No user with that id")
    } else{
        res.json({message:"user profile updated successfully"})
    }
})


app.listen(3000, ()=>console.log("server listening at 3000"));