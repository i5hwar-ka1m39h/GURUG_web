const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json())

//mongoose model and schema defination

const kamSchema = new mongoose.Schema({
    taskName: String,
    description: String,
    isDone: Boolean
});

const Kam = mongoose.model("Kam", kamSchema);


//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/gurugDB")




//home page
app.get("/home", (req: Request, res: Response )=>{
    res.send("yokoso watashi no soul society")
})

//get all tasks in the db
app.get("/task", async(req: Request, res: Response)=>{
    const tasks = await Kam.find({});
    res.status(200).json({tasks});
})

//get a single task in db
app.get("/task/:id", async(req: Request, res: Response)=>{
    const id = req.params.id;
    const singleTask = await Kam.findById(id);
    res.json({singleTask})
})

//saving the task in the db
app.post("/task", (req: Request, res: Response)=>{
    const {taskName, description, isDone} = req.body;
    const obj = {taskName: taskName, description: description, isDone: isDone};
    const newKam = new Kam(obj);
    newKam.save()
    res.status(200).json({"message": "done boss"})
})

//updating the single task
app.put("/task/:id", async(req: Request, res: Response)=>{
    const id = req.params.id;
    const {taskName, description, isDone} = req.body;
    const updatedObj = {taskName: taskName, description: description, isDone: isDone};
    const lastupdate= await Kam.findByIdAndUpdate(id, updatedObj);
    console.log(lastupdate);
    if(!lastupdate){
        return res.status(404).json({"error":"not found"})
    }else{
        res.status(200).json({"message": "updated successfully"})
    }
})

app.listen(3000, ()=>console.log("app is listening at port 3000"))