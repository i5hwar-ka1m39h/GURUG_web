import { useEffect, useState } from "react";
import axios from "axios";




const AllTeacher = ()=>{
  const [teacher, setTeacher] = useState([]);
  const getTeacher = async()=>{
    try {
      const response = await axios.get('http://localhost:3000/teachers',{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      });
      const data = response.data;
      setTeacher(data);
    } catch (err) {
      console.error(err); 
    }
  }

  useEffect(()=>{getTeacher()},[teacher])
  return(
    <div>
      {teacher.map(i=>{
        return(
          <div key={i._id}>
            <h1>{i.name}</h1>
            <p>{i.subject}</p>
            <p>{i.experience}</p><br /><br />
          </div>
        )
      })}
    </div>
  )
}




export default AllTeacher;