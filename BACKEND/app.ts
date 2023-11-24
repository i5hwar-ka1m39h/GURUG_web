import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
app.use(express.json());
app.use(cors());



//connecting to the db
mongoose.connect("mongodb://127.0.0.1:27017/gurugDB", {dbName: "gugugDB"});

app.use("/auth", authRoutes);
app.use("/course", courseRoutes)

//home page
app.get("/home", (req, res)=>{
  res.send("this is home page!!!");
})


app.listen(3000, ()=>console.log("app is listening at port 3000"))