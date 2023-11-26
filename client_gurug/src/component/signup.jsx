import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const SignUp = ()=>{
  const handleClick= async()=>{

  }
  return(
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width:'100vh'}} >
      <Card sx={{ minWidth: 275, padding:2 }}>
        <Typography variant="h5" component="div"> welcome to guruG</Typography>

        <TextField id="outlined-basic" label="email" variant="outlined" /><br /><br />
        <TextField id="outlined-basic" label="password" variant="outlined" /><br /><br />
        <Button variant="contained" onClick={handleClick}>Sign Up</Button>
      </Card>
      
    </div>
  )
}


export default SignUp;