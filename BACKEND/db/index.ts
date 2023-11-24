import mongoose from 'mongoose';

//define schema
const studentSchema = new mongoose.Schema({
  userName: String,
  password: String,
  purchasedCourses: [{type: mongoose.Types.ObjectId, ref: 'Course'}]
})

const adminSchema = new mongoose.Schema({
  userName: String,
  password: String,
  publishedCourses: [{type: mongoose.Types.ObjectId, ref:'Course'}]
})

const courseSchema = new mongoose.Schema({
  title: String, 
  description: String,
  price: Number,
  imageUrl: String,
  authorId: { type: mongoose.Types.ObjectId, ref: 'User' },
  isPublished: Boolean
})

//define model
 export const Student = mongoose.model("Student",studentSchema);
 export const Admin = mongoose.model("Admin",adminSchema)
 export const Course = mongoose.model("Course",courseSchema)


 