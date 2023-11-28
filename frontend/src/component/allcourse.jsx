import axios from "axios";
import { useEffect, useState } from "react"





const AllCourse = ()=>{
  const [ courses, setCourses] = useState([]);

  const getCourse = async()=>{
    
    try {
      const response = await axios.get('http://localhost:3000/courses',{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      });
      const data = response.data;
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{ getCourse()}, [courses])

  return(
    <div>
     
    {courses.map(i=>{
      return(
        <div key={i._id}>
          <h1>{i.title}</h1>
          <p>{i.description}</p>
          <p>{i.price}</p>
        </div>
      )
    })}
    
    </div>
  )
}


export default AllCourse;