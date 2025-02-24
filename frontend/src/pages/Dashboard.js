import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Dashboard() {
    const [loggedInUser, setloggedInUser] = useState('');
    const [details, setDetails] = useState('');
    const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        setloggedInUser (localStorage.getItem('loggedInUser'))
    },[])
  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Loggedout')
    setTimeout(() =>{
  navigate('/login');
    },1000)
  }

const fetchDetails = async () => {
  const token = localStorage.getItem('token'); // Or however you're storing the token
  
  try {
    const response = await fetch('http://localhost:8080/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': token, // Make sure this matches your backend expectation
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unauthorized');
    }

    const data = await response.json();
    // Handle successful response
  } catch (error) {
    console.error('Fetch error:', error);
    // Handle error (e.g., redirect to login, show error message)
  }
};

const token = localStorage.getItem('token');
fetch('/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

//For Google Login
const googleToken = localStorage.getItem('googleToken');
fetch('/dashboard', {
  headers: {
    'Authorization': `Google ${googleToken}`,
    'Content-Type': 'application/json'
  }
});
  useEffect(() => {
    fetchDetails()
  },[])
  return (
    <div><h1> Welcome...{loggedInUser}</h1>
    <button onClick={handleLogout}>Logout</button>
    <div>
        {
            details && details?.map((item, index)=>(
                <ul key={index}>
<span>{item.name} : {item.price} </span>
                </ul>
            ))
        }
    </div>
    <ToastContainer/>
    </div>
  )
}

export default Dashboard
