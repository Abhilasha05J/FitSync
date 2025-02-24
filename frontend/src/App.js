import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import Dashboard from './pages/Dashboard';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import VerifyOtp from './pages/VerifyOtp';
import Chatbot from './pages/Chatbot';
import GoogleFit from './pages/GoogleFit'


function App() {
  //private routing
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const PrivateRoute = ({element})=>{
    return isAuthenticated ? element : <Navigate to ="/login"/>
  }


  return (
<div className="App">
  <RefreshHandler setIsAuthenticated = {setIsAuthenticated}/>
  <Routes>
  <Route
    path="/fit"
    element={<a href="http://localhost:8080/auth">Connect with Google Fit</a>}
/>
  <Route path='/' element={<Navigate to="/login"/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='verifyotp' element={<VerifyOtp/>}/>
    <Route path='Chatbot' element={<Chatbot/>}/>
    <Route path='googleFit' element={<GoogleFit/>}/>
    <Route path='/userdashboard' element={<PrivateRoute element = {<UserDashboard/>}/>}/>
    <Route path='/dashboard' element={<PrivateRoute element = {<Dashboard/>}/>}/>
  </Routes>
</div>
  );
}

export default App;
