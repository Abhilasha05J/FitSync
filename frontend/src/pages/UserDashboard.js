import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import Chatbot from "./Chatbot";
import "./UserDashboard.css";
import { handleError } from '../utils';
import { ToastContainer } from 'react-toastify';

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [fitnessData, setFitnessData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load user data from localStorage
  const loadUserData = () => {
    const name = localStorage.getItem("loggedInUser");
    const email = localStorage.getItem("userEmail");
    const picture = localStorage.getItem("userPicture");

    if (name && email && picture) {
      setUserData({ name, email, picture });
    } else {
      navigate("/login"); // Redirect to login if data is missing
    }
  };

  // Fetch Google Fit data
  const fetchFitData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/fit-data", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFitnessData(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
        setFitnessData([]);
      }
    } catch (error) {
      console.error("Error fetching Google Fit data:", error);
      setIsConnected(false);
      setFitnessData([]);
    } finally {
      setLoading(false);
    }
  };

  
  // Handle Google Fit connection
  const handleConnect = () => {
    window.location.href = "http://localhost:8080/auth";
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setFitnessData([]);
  };

  // Logout user
  const handleLogout = () => {
    localStorage.clear();
    setIsConnected(false);
    setFitnessData([]);
    navigate("/login");
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Handle card click to display chart
  const handleCardClick = (cardType) => {
    if (!isConnected) {
      handleError("Please connect to Google Fit to view this data.");
      return;
    }
    setSelectedCard(cardType);
  };

  // Prepare chart data for rendering
  const prepareChartData = (type) => {
    if (!fitnessData || fitnessData.length === 0) return null;

    const labels = fitnessData.map((data) => data.date);

    const dataPoints = fitnessData.map((data) => {
      switch (type) {
        case "steps":
          return data.step_count;
        case "heart_rate":
          return data.heart_rate;
        case "glucose_level":
          return data.glucose_level;
        case "sleep_hours":
          return data.sleep_hours;
          case "blood_pressure":
            return data.blood_pressure;
          case "weight":
            return data.weight;
          case "height_in_cms":
            return data.height_in_cms;
          case "body_fat_in_percent":
            return data.body_fat_in_percent;
        default:
          return 0;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: `${type.replace("_", " ").toUpperCase()} Data`,
          data: dataPoints,
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  useEffect(() => {
    loadUserData();
    fetchFitData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          {sidebarOpen ? "❮" : "❯"}
        </button>
        <div className="sidebar-content">
          <h2>FitSync</h2>
          <ul className="menu">
            <li><div className="profile-container">
{userData ? (
    <div className="profile-image"> 
    <img
      src={userData.picture}
      alt="Profile"
      className="profile-picture"
    />
    </div>
   
) : (
  <p>Loading user data...</p>
)}
</div></li>
            <li>
              {isConnected ? (
                <button onClick={handleDisconnect}>Disconnect</button>
              ) : (
                <button onClick={handleConnect}>Connect Google Fit</button>
              )}
            </li>
            <li> <button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          {/* <div className="profile-container">
            {userData ? (
              <div className="profile-info">
                <div className="profile-image"> 
                <img
                  src={userData.picture}
                  alt="Profile"
                  className="profile-picture"
                />
                </div>
                <button onClick={handleLogout}>Logout</button>
                <div className="profile-details">
                  <h3>{userData.name}</h3>
                  <p>{userData.email}</p>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div> */}

        </header>

        {/* Summary Cards */}
        <section className="dashboard-grid">
          <div
            className="summary-card"
            onClick={() => handleCardClick("steps")}
          >
            <i className="fas fa-running"></i>
            <h3>Steps</h3>
            <p>Track your daily steps.</p>
          </div>
          <div
            className="summary-card"
            onClick={() => handleCardClick("heart_rate")}
          >
             <i className="fas fa-heartbeat"></i>
            <h3>Heart Rate</h3>
            <p>Monitor your heart rate.</p>
          </div>
          <div
            className="summary-card"
            onClick={() => handleCardClick("glucose_level")}
          >
             <i class="fa-solid fa-prescription-bottle"></i>
            <h3>Glucose</h3>
            <p>Analyze your glucose levels.</p>
          </div>
          <div
            className="summary-card"
            onClick={() => handleCardClick("sleep_hours")}
          >
             <i className="fas fa-bed"></i>
            <h3>Sleep</h3>
            <p>Track your sleep patterns.</p>
          </div>
          <div
            className="summary-card"
            onClick={() => handleCardClick("blood_pressure")}
          >
            <i class="fa-solid fa-droplet"></i>
            <h3>Blood Pressure</h3>
            <p>Check blood pressure levels.</p>
          </div>
          <div
            className="summary-card"
            onClick={() => handleCardClick("weight")}
          >
            <h3>Weight</h3>
            <p>Analyze your weight.</p>
          </div>
          <div
            className="summary-card"
            onClick={() => handleCardClick("height_in_cms")}
          >
            <h3>Height</h3>
            <p>height data in centimeters.</p>
          </div>
          <div
            className="summary-card"
            onClick={() => handleCardClick("body_fat_in_percent")}
          >
            <h3>Body Fat</h3>
            <p>body fat percentage.</p>
          </div>

        </section>

        {/* Detailed Chart */}
        {selectedCard && (
          <section className="chart-section">
            <br></br>
            {/* <h2>{selectedCard.replace("_", " ").toUpperCase()} Data</h2> */}
            {prepareChartData(selectedCard) ? (
              <Line data={prepareChartData(selectedCard)} />
            ) : (
              <p>No data available for {selectedCard}</p>
            )}
          </section>
        )}

        {/* Loading */}
        {loading && <p>Loading data...</p>}

        {/* Floating Chatbot Button */}
        {!chatOpen && (
          <Fab
            color="secondary"
            aria-label="chatbot"
            onClick={() => setChatOpen(true)}
            sx={{ position: "fixed", bottom: 16, right: 16 }}
          >
            <ChatIcon />
          </Fab>
        )}

        {/* Chatbot */}
        {chatOpen && <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />}
      </div>
       <ToastContainer />
    </div>
  );
};

export default UserDashboard;




