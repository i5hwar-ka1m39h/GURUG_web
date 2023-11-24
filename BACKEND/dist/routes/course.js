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
const middleware_1 = require("../middleware");
const db_1 = require("../db");
//admin course add
router.post("/admin/course", middleware_1.handleToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = new db_1.Course(req.body);
    yield course.save();
    res.json({ message: "course added successfully" });
}));
//admin show course
router.get("/admin/courses", middleware_1.handleToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield db_1.Course.find({});
    res.json({ courses });
}));
//admin update course
router.put("/admin/course/:courseId", middleware_1.handleToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield db_1.Course.findByIdAndUpdate(req.params.courseId, req.body);
    if (course) {
        res.json({ message: "updated successfully" });
    }
    else {
        res.status(404).json({ message: "not found" });
    }
}));
//get courses in which student have enrolled
router.get("/student/course", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield db_1.Course.find({});
    res.json({ course });
}));
exports.default = router;
