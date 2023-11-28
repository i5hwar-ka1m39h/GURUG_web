import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './component/login'
import SignUp from './component/signup'
import LandingPage from './component/landing';
import AllCourse from './component/allcourse';
import AllTeacher from './component/allteacher';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path='/allcourse' element={<AllCourse/>}/>
          <Route path='/allteacher' element={<AllTeacher/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App

