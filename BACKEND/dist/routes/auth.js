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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const middleware_1 = require("../middleware");
//admin signup
router.post("/admin/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    const returnedUser = yield db_1.Admin.find({ userName: userName });
    if (returnedUser.length > 0) {
        return res.status(500).json({ message: "username already exist!" });
    }
    else {
        let newAdmin = new db_1.Admin({ userName: userName, password: password });
        newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ id: newAdmin._id, role: 'admin' }, middleware_1.KEY, { expiresIn: '1hr' });
        res.json({ message: "admin saved successfully", token });
    }
}));
//admin login
router.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    const adminFind = yield db_1.Admin.findOne({ userName, password });
    if (adminFind) {
        const token = jsonwebtoken_1.default.sign({ id: adminFind._id, role: 'admin' }, middleware_1.KEY, { expiresIn: '1hr' });
        res.json({ message: "logged in successfully", token });
    }
    else {
        res.status(401).json({ message: 'wrong username or password!' });
    }
}));
//student sign up
router.post("/student/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    const returnedUser = yield db_1.Student.find({ userName: userName });
    if (returnedUser) {
        return res.status(500).json({ message: "username already exist!" });
    }
    else {
        let newStudent = new db_1.Student({ userName: userName, password: password });
        newStudent.save();
        const token = jsonwebtoken_1.default.sign({ id: newStudent._id, role: 'student' }, middleware_1.KEY, { expiresIn: '1hr' });
        res.json({ message: "student saved successfully", token });
    }
}));
//student login
router.post("/student/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    const user = yield db_1.Student.findOne({ userName: userName });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: 'student' }, middleware_1.KEY, { expiresIn: '1hr' });
        res.status(200).json({ message: "logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "invalid username or password" });
    }
}));
exports.default = router;
