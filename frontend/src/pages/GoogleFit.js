import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary components for Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GoogleFit = () => {
  const [fitData, setFitData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFitData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/fit-data', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFitData(data);
      } catch (error) {
        console.error("Error fetching fit data:", error);
        setError("Failed to load data");
      }
    };

    fetchFitData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!fitData || !fitData.bucket || fitData.bucket.length === 0) {
    return <div>No data available</div>;
  }

  // const chartData = {
  //   labels: fitData.bucket.map((bucket) => {
  //     const startTime = parseInt(bucket.startTimeMillis);
  //     return !isNaN(startTime)
  //       ? new Date(startTime).toLocaleDateString()
  //       : 'Invalid Date';
  //   }),
  //   datasets: [
  //     {
  //       label: 'Steps',
  //       data: fitData.bucket.map((bucket) => {
  //         if (!bucket.dataset || bucket.dataset.length === 0) return 0;
  //         const steps = bucket.dataset[0]?.point[0]?.value[0]?.intVal;
  //         return steps || 0;
  //       }),
  //       borderColor: 'rgba(75,192,192,1)',
  //       backgroundColor: 'rgba(75,192,192,0.2)',
  //       fill: true,
  //       tension: 0.4, // Add smooth curves
  //     },
  //   ],
  // };
  const chartData = {
    labels: fitData.bucket.map((bucket) => {
      const startTime = parseInt(bucket.startTimeMillis);
      return !isNaN(startTime)
        ? new Date(startTime).toLocaleDateString()
        : 'Invalid Date';
    }),
    datasets: [
      {
        label: 'Steps',
        data: fitData.bucket.map((bucket) => {
          const steps = bucket.dataset.find((dataset) => dataset.dataTypeName === 'com.google.step_count.delta')?.points[0]?.values[0]?.intVal;
          return steps || 0;
        }),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Heart Rate (BPM)',
        data: fitData.bucket.map((bucket) => {
          const heartRate = bucket.dataset.find((dataset) => dataset.dataTypeName === 'com.google.heart_rate.bpm')?.points[0]?.values[0]?.fpVal;
          return heartRate || 0;
        }),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'blood_pressure',
        data: fitData.bucket.map((bucket) => {
          const calories = bucket.dataset.find((dataset) => dataset.dataTypeName === 'com.google.blood_pressure')?.points[0]?.values[0]?.fpVal;
          return calories || 0;
        }),
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Sleep Duration (Minutes)',
        data: fitData.bucket.map((bucket) => {
          const sleep = bucket.dataset.find((dataset) => dataset.dataTypeName === 'com.google.sleep.segment')?.points[0]?.values[0]?.intVal;
          return sleep || 0;
        }),
        borderColor: 'rgba(255,159,64,1)',
        backgroundColor: 'rgba(255,159,64,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'blood_glucose',
        data: fitData.bucket.map((bucket) => {
          const calories = bucket.dataset.find((dataset) => dataset.dataTypeName === 'com.google.blood_glucose')?.points[0]?.values[0]?.fpVal;
          return calories || 0;
        }),
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'temperature',
        data: fitData.bucket.map((bucket) => {
          const calories = bucket.dataset.find((dataset) => dataset.dataTypeName === 'com.google.body.temperature')?.points[0]?.values[0]?.fpVal;
          return calories || 0;
        }),
        borderColor: 'rgb(176, 125, 164)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'nutrition',
        data: fitData.bucket.map((bucket) => {
          const calories = bucket.dataset.find((dataset) => dataset.dataTypeName === 'com.google.nutrition')?.points[0]?.values[0]?.fpVal;
          return calories || 0;
        }),
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'oxygen_saturation',
        data: fitData.bucket.map((bucket) => {
          const calories = bucket.dataset.find((dataset) => dataset.dataTypeName === 'com.google.oxygen_saturation')?.points[0]?.values[0]?.fpVal;
          return calories || 0;
        }),
        borderColor: 'rgb(135, 57, 130)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };


  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Google Fit Data',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Steps',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default GoogleFit;


