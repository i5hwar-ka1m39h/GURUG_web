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
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const PORT = 3000;
const KEY = "this is the key to knowledge";
app.use(express_1.default.json());
const teacherSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    password: String,
    subject: String,
    experience: Number,
    imgUrl: String,
    coureseMADE: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' }]
});
const studentSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    password: String,
    courseSUB: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' }]
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imgUrl: String,
    teacherId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Teacher' },
    studentsId: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Student' }]
});
const Teacher = mongoose_1.default.model("Teacher", teacherSchema);
const Student = mongoose_1.default.model("Student", studentSchema);
const Course = mongoose_1.default.model("Course", courseSchema);
mongoose_1.default.connect("mongodb://127.0.0.1:27017/gurugDB");
//lets create a middlewear for few routes
const middleAUTH = (req, res, next) => {
    const authHEAD = req.headers.authorization;
    if (authHEAD) {
        const token = authHEAD.split(" ")[1];
        jsonwebtoken_1.default.verify(token, KEY, (err, payload) => {
            if (err) {
                return res.status(403).json({ message: "forbidden" });
            }
            if (!payload) {
                return res.status(403).json({ message: "forbidden" });
            }
            if (typeof (payload) === 'string') {
                return res.status(403).json({ message: "forbidden" });
            }
            req.headers["userID"] = payload.id;
            next();
        });
    }
    else {
        res.status(401).json({ message: "authorization failed" });
    }
};
//general sign up route
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, isTeacher } = req.body;
    console.log(isTeacher);
    if (isTeacher) {
        const ans = yield Teacher.findOne({ email: email });
        if (ans) {
            return res.status(400).json({ message: "user already exist" });
        }
        else {
            const newTeacher = new Teacher({ email, password });
            yield newTeacher.save();
            const token = jsonwebtoken_1.default.sign({ id: newTeacher._id, role: "teacher" }, KEY, { expiresIn: '2hr' });
            res.status(200).json({ message: "user(teacher) signed up successfully", token });
        }
    }
    else {
        const ans = yield Student.findOne({ email: email });
        if (ans) {
            return res.status(400).json({ message: "user already exist" });
        }
        else {
            const newStudent = new Student({ email, password });
            yield newStudent.save();
            const token = jsonwebtoken_1.default.sign({ id: newStudent._id, role: "student" }, KEY, { expiresIn: '2hr' });
            res.status(200).json({ message: "user(student) signed up successfully", token });
        }
    }
}));
//route to set up profile student
app.post("/signup/profileStudent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    const student = yield Student.findOne({ email: email });
    if (student) {
        student.name = name;
        yield student.save();
        res.status(200).json({ message: "profile set up successfully" });
    }
    else {
        res.status(400).json({ message: "user not found" });
    }
}));
//route to setup the teacher profile
app.post("/signup/profileTeacher", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, subject, experience, imgUrl } = req.body;
    const teacher = yield Teacher.findOne({ email: email });
    if (teacher) {
        teacher.name = name;
        teacher.subject = subject;
        teacher.experience = experience;
        teacher.imgUrl = imgUrl;
        yield teacher.save();
        res.status(200).json({ message: "profile set up successfully" });
    }
    else {
        res.status(400).json({ message: "user not found" });
    }
}));
//log in route
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const ans1 = yield Teacher.findOne({ email: email });
    if (ans1) {
        const token = jsonwebtoken_1.default.sign({ id: ans1._id, role: 'teacher' }, KEY, { expiresIn: '2hr' });
        res.status(200).json({ message: "teacher logged in successfully", token });
    }
    else {
        const ans2 = yield Student.findOne({ email: email });
        if (ans2) {
            const token = jsonwebtoken_1.default.sign({ id: ans2._id, role: 'student' }, KEY, { expiresIn: '2hr' });
            res.status(200).json({ message: "student logged in successfully", token });
        }
        else {
            res.status(400).json({ message: "user not found" });
        }
    }
}));
//adding the course
app.post("/addCourse/:teacherId", middleAUTH, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, imgUrl } = req.body;
    const { teacherId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ message: "Invalid teacher ID format" });
    }
    const teacher = yield Teacher.findById(teacherId);
    if (teacher) {
        const newCourse = new Course({ title, description, price, imgUrl, teacherId });
        yield newCourse.save();
        res.status(200).json({ message: "course saved successfully" });
    }
    else {
        res.status(400).json({ message: "the user(teacher) not found" });
    }
}));
//updating the course
app.put("/updateCourse/:courseId", middleAUTH, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, imgUrl } = req.body;
    const { courseId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid course ID format" });
    }
    const course = yield Course.findById(courseId);
    if (course) {
        course.title = title;
        course.description = description;
        course.price = price;
        course.imgUrl = imgUrl;
        yield course.save();
        res.status(200).json({ message: "course updated successfully" });
    }
    else {
        res.status(400).json({ message: "couldn't find the course with given id" });
    }
}));
//deleting the course
app.delete("/deleteCourse/:courseId", middleAUTH, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid course ID format" });
    }
    const deleteCourse = yield Course.findByIdAndDelete(courseId);
    if (deleteCourse) {
        res.status(200).json({ message: "course deleted successfully" });
    }
    else {
        res.status(400).json({ message: "couldn't find the course with given id" });
    }
}));
//get all the course
app.get("/courses", middleAUTH, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Course.find();
    res.status(200).json(courses);
}));
//get specific course info
app.get("/courses/:courseId", middleAUTH, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid course ID format" });
    }
    const course = yield Course.findById(courseId);
    if (course !== null) {
        res.status(200).json(course);
    }
    else {
        res.status(400).json({ message: "couldn't find the course with given id" });
    }
}));
//get all teachers
app.get("/teachers", middleAUTH, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teachers = yield Teacher.find();
    res.status(200).json(teachers);
}));
app.listen(PORT, () => console.log(`app is listening at port ${PORT}`));
