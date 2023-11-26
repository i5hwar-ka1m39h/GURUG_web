import axios from 'axios';
import { useState } from 'react';






const Login= ()=>{
  const[email, setemail] = useState('');
  const [password, setPassword] = useState('');
 

 const handleSignUp = async()=>{
  console.log('hwllow there');
  try{
    const response = await axios.post('http://localhost:3000/login', {email, password});
    console.log(response);
    const data = response.data;
    console.log(data.token);
    if(data.token){
      localStorage.setItem("token", data.token);
      window.location.href='https://flamecomics.com/'
    }else{
      alert('error');
    }
  }catch(err){
    console.error(err);
  }
 }

  return(
    <div >
      <input type="email" value={email} onChange={(e)=>setemail(e.target.value)} placeholder='email' /><br />
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='password' /><br />
      
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  )
}

export default Login;