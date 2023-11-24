"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.Admin = exports.Student = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//define schema
const studentSchema = new mongoose_1.default.Schema({
    userName: String,
    password: String,
    purchasedCourses: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Course' }]
});
const adminSchema = new mongoose_1.default.Schema({
    userName: String,
    password: String,
    publishedCourses: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Course' }]
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    authorId: { type: mongoose_1.default.Types.ObjectId, ref: 'User' },
    isPublished: Boolean
});
//define model
exports.Student = mongoose_1.default.model("Student", studentSchema);
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
exports.Course = mongoose_1.default.model("Course", courseSchema);
