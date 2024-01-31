import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function SignUpPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    
    return(
        <div className=" mt-40 flex items-center justify-center h-screen" >
            <Card style={{padding:10, width:500}}>
            <Input type="text" placeholder="email" name="email" onChange={e=>{setEmail(e.target.value)}}/> <br />
            <Input type="password" placeholder="password" name="password" onChange={e=>{setPassword(e.target.value)}} /> <br />
            <Button onClick={async()=>{
                const response = await axios.post("http://localhost:3000/signup",{
                    email,
                    password
                })
                console.log(response);
                let data = response.data;
                console.log(data.token);
                
                localStorage.setItem("token", data.token);
                navigate("/courses")
                
            }}>Sign Up</Button>
            </Card>
        </div>
    )
}

export default SignUpPage;