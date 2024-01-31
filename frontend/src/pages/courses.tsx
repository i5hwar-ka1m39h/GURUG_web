import axios from "axios";
import { useEffect, useState } from "react"

export default function ALLCourses(){
    const [courses, setCourses] = useState([]);
    useEffect(()=>{
        const fetchCourses = async()=>{
            const response = await axios.get("http://localhost:3000/courses")
        console.log(response.data);
        setCourses(response.data.courses)
        }
        fetchCourses();
    },[])
    return(
        <div className="mt-50">
            hi there
            {courses.map(course=>{return(
                <div>
                    <CourseCard course={course}/>
                </div>
            )})}
        </div>
    )
}



function CourseCard({course}:any){
    return(
        <div>
            <h1>{course.title}</h1>
            <h3>{course.description}</h3>
            <img src={course.thumbnail} alt="" />
        </div>
    )
}