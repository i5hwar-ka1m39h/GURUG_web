import axios from "axios";
import { useState } from "react"

export default function CreateCourseCard(){
    const [title, setTitle]= useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice]= useState("");
    const [thumbnail, setThumbnail]= useState('');
    const [videoUrl,setVideoUrl]= useState('');
    
    
    
    return(
        <div className="mt-50">
        <input type="text" name="title" placeholder="title" onChange={e=>{setTitle(e.target.value)}}/><br />
        <input type="text" name="description" placeholder="description" onChange={e=>{setDescription(e.target.value)}} /><br />
        <input type="text" name="price" placeholder="price" onChange={e=>{setPrice(e.target.value)}} /><br />
        <input type="text" name="thumbnail" placeholder="thumbnail" onChange={e=>{setThumbnail(e.target.value)}} /><br />
        <input type="text" name="videoUrl" placeholder="videoUrl" onChange={e=>{setVideoUrl(e.target.value)}}/><br />
        <button onClick={async()=>{
            const response = await axios.post('http://localhost:3000/createCouse',{
                title,
                description,
                price,
                thumbnail,
                videoUrl
            },{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            console.log(response);
            
        }}>Create Course</button>
        </div>
    )
}