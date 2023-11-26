import axios from 'axios';
import { useState } from 'react';






const SignUp= ()=>{
  const[email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);

 const handleSignUp = async()=>{
  console.log('hwllow there');
  try{
    const response = await axios.post('http://localhost:3000/signup', {email, password, isTeacher});
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
      are you a teacher-<input type="checkbox" value={isTeacher} onChange={(e)=>setIsTeacher(true)} /><br/>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  )
}

export default SignUp;