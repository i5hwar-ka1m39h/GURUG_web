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
exports.authenticateJwt = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const SECRET = "secret";
const teacherSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    name: String,
    courseCreated: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' }]
});
const studentSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    name: String,
    courseSubscribed: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' }]
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    isPublished: Boolean,
    imgUrl: String,
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Teacher' },
    studentSubscribers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Student' }]
});
const Teacher = mongoose_1.default.model("Teacher", teacherSchema);
const Student = mongoose_1.default.model("Student", studentSchema);
const Course = mongoose_1.default.model("Course", courseSchema);
mongoose_1.default.connect('mongodb://127.0.0.1:27017/gurugDB');
const authenticateJwt = (req, res, next) => {
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
            req.headers["userId"] = payload.id;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;
//hash generator 
const hashGenerate = (password) => __awaiter(void 0, void 0, void 0, function* () {
    let saltRound = 10;
    const hashedPass = yield bcrypt_1.default.hash(password, saltRound);
    return hashedPass;
});
const comparePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bcrypt_1.default.compare(password, hash);
    return result;
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, isTeacher } = req.body;
    try {
        if (isTeacher) {
            const teacher = yield Teacher.findOne({ email: email });
            if (teacher) {
                return res.status(409).json({ message: "User already exists" });
            }
            else {
                const hasH = yield hashGenerate(password);
                const newTeacher = new Teacher({ email: email, password: hasH });
                yield newTeacher.save();
                const token = jsonwebtoken_1.default.sign({ id: newTeacher._id, role: 'Teacher' }, SECRET, { expiresIn: '24h' });
                res.status(200).json({ message: "Teacher saved successfully", token });
            }
        }
        else {
            const student = yield Student.findOne({ email: email });
            if (student) {
                return res.status(409).json({ message: "User already exists" });
            }
            else {
                const hasH = yield hashGenerate(password);
                const newStudent = new Student({ email: email, password: hasH });
                yield newStudent.save();
                const token = jsonwebtoken_1.default.sign({ id: newStudent._id, role: 'Student' }, SECRET, { expiresIn: '24h' });
                res.status(200).json({ message: "Student saved successfully", token });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(501).json({ message: "internal error ", error });
    }
}));
app.post("/login", exports.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield Teacher.findOne({ email });
        if (user) {
            //@ts-ignore
            const isPasswordValid = yield comparePassword(password, user.password);
            if (isPasswordValid) {
                const token = jsonwebtoken_1.default.sign({ id: user._id, role: 'Teacher' }, SECRET, { expiresIn: '24hr' });
                res.status(200).json({ message: 'teacher logged in successfully', token });
            }
            else {
                res.status(401).json({ error: 'invalid password' });
            }
        }
        else {
            const student = yield Student.findOne({ email });
            if (student) {
                //@ts-ignore
                const isPasswordValid = yield comparePassword(password, student.password);
                if (isPasswordValid) {
                    const token = jsonwebtoken_1.default.sign({ id: student._id, role: 'Student' }, SECRET, { expiresIn: '24hr' });
                    res.status(200).json({ message: 'student logged in successfully', token });
                }
                else {
                    res.status(401).json({ error: 'Invalid login credentials' });
                }
            }
            else {
                res.status(404).json({ error: 'user not found' });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal error", error });
    }
}));
app.listen(3000, () => {
    console.log('listening at port 3000');
});
