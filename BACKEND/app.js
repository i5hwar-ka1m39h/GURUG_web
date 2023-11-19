"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());
//mongoose model and schema defination
const kamSchema = new mongoose.Schema({
    taskName: String,
    description: String,
    isDone: Boolean
});
const Kam = mongoose.model("Kam", kamSchema);
//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/gurugDB");
//home page
app.get("/home", (req, res) => {
    res.send("yokoso watashi no soul society");
});
//get all tasks in the db
app.get("/task", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield Kam.find({});
    res.status(200).json({ tasks });
}));
//get a single task in db
app.get("/task/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const singleTask = yield Kam.findById(id);
    res.json({ singleTask });
}));
//saving the task in the db
app.post("/task", (req, res) => {
    const { taskName, description, isDone } = req.body;
    const obj = { taskName: taskName, description: description, isDone: isDone };
    const newKam = new Kam(obj);
    newKam.save();
    res.status(200).json({ "message": "done boss" });
});
//updating the single task
app.put("/task/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { taskName, description, isDone } = req.body;
    const updatedObj = { taskName: taskName, description: description, isDone: isDone };
    const lastupdate = yield Kam.findByIdAndUpdate(id, updatedObj);
    console.log(lastupdate);
    if (!lastupdate) {
        return res.status(404).json({ "error": "not found" });
    }
    else {
        res.status(200).json({ "message": "updated successfully" });
    }
}));
app.listen(3000, () => console.log("app is listening at port 3000"));
