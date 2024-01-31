import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import SignUpPage from './pages/signup'
import ALLCourses from './pages/courses'
import CreateCourseCard from './pages/createcourse'
import AppBar from './pages/appbar'

function App() {
  

  return (
    <>
    
      <Router>
      <AppBar/>
        <Routes>
          <Route path={'/signup'} element={<SignUpPage/>}/>
          <Route path={'/courses'} element={<ALLCourses/>}/>
          <Route path={'/createcourse'} element={<CreateCourseCard/>}/>
          
        </Routes>
      </Router>
    </>
  )
}

export default App
