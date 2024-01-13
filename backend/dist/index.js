"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SECRET = "secret";
const app = (0, express_1.default)();
app.use(express_1.default.json());
//connect to database
mongoose_1.default.connect('mongodb://localhost:27017/gurug');
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    userName: String,
    isTeacher: Boolean,
    courseSubscribed: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Course' }],
    courseCreated: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Course' }]
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    videoUrl: String,
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
});
const User = mongoose_1.default.model("User", userSchema);
const Course = mongoose_1.default.model("Course", courseSchema);
const saltRound = 10;
const hashingPass = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = yield bcrypt_1.default.hash(password, saltRound);
        return hash;
    }
    catch (error) {
        console.error("from hash generation", error);
    }
});
const compareHash = (plainPassword, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield bcrypt_1.default.compare(plainPassword, hash);
        return result;
    }
    catch (error) {
        console.error("from hash comparison", error);
    }
});
const authUserJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, SECRET, (err, payload) => {
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
    }
    else {
        res.sendStatus(401);
    }
};
//find email
const findUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ email });
    return user;
});
//signUP
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield findUser(email);
    if (user) {
        return res.status(409).json({ message: "Email already in use" });
    }
    else {
        const hashPass = yield hashingPass(password);
        const newUser = new User({ email: email, password: hashPass });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, "secret", { expiresIn: '24hr' });
        res.json({ message: 'User created successfully', token });
    }
}));
//login
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield findUser(email);
    if (!user) {
        return res.status(401).json({ message: 'email does not exist in databasr' });
    }
    else {
        //@ts-ignore
        const isValidPassword = yield compareHash(password, user.password);
        if (isValidPassword) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, "secret", { expiresIn: '24hr' });
            res.json({ message: 'Logged in successfully', token });
        }
        else {
            res.status(401).json('Invalid Password');
        }
    }
}));
//create course
app.post("/createCouse", authUserJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = new Course(req.body);
    yield course.save();
    res.json({ message: 'Course created successfully', courseId: course._id });
}));
//update course
app.put("/updateCourse/:courseId", authUserJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (!course) {
        return res.status(404).send("No course with that");
    }
    else {
        res.json({ message: "course updated successfully", course });
    }
}));
//delete course
app.delete("/deleteCourse/:courseId", authUserJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
        return res.status(404).send("No course with that id");
    }
    else {
        res.json({ message: "course deleted successfully" });
    }
}));
//get all the course
app.get("/courses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Course.find({});
    res.json({ courses });
}));
//updateprofile
app.put("/updateProfile/userId", authUserJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findByIdAndUpdate(req.params.userId, req.body);
    if (!user) {
        return res.status(404).send("No user with that id");
    }
    else {
        res.json({ message: "user profile updated successfully" });
    }
}));
app.listen(3000, () => console.log("server listening at 3000"));
