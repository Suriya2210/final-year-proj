import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './App.css'; // Import CSS file for custom styles

const App = () => {
  const [dataV0, setDataV0] = useState({
    gas: 0,
    tds: 0,
    pH: 0
  });

  const [water, setWater] = useState(0);
  const [flow, setFlow] = useState(0);
  const [temp, setTemp] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState('Loading...'); // Default status
  const intervalRef = useRef(null);
  const [intervalId, setIntervalRef] = useState(null);

  useEffect(() => {
    fetchData();

    intervalRef.current = setInterval(fetchData, 5000); // Default refresh interval: 5 seconds

    return () => clearInterval(intervalRef.current);
  }, []);

  const fetchData = async () => {
    try {
      const responseV0 = await fetch('https://blynk.cloud/external/api/get?token=s_Xbhek5vkqJBgudsAJkmIvVawSisYe3&V0');
      const responseV1 = await fetch('https://blynk.cloud/external/api/get?token=s_Xbhek5vkqJBgudsAJkmIvVawSisYe3&V1');
      const statusResponse = await fetch('https://blynk.cloud/external/api/isHardwareConnected?token=s_Xbhek5vkqJBgudsAJkmIvVawSisYe3');
      
      const dataV0String = await responseV0.text();
      const dataV1String = await responseV1.text();
      const statusData = await statusResponse.json(); // Assuming the response is JSON

      setDataV0(parseDataV0(dataV0String));
      parseDataV1(dataV1String);
      
      // Set device status based on the response
      setDeviceStatus(statusData ? 'Online' : 'Offline');
    } catch (error) {
      console.error('Error fetching data:', error);
      setDeviceStatus('Error'); // Set status to error if there's an error
    }
  };

  const parseDataV0 = (dataString) => {
    const values = dataString.split(' ');
    return {
      gas: parseInt(values[0].split(':')[1]),
      tds: parseInt(values[1].split(':')[1]),
      pH: parseInt(values[2].split(':')[1])
    };
  };

  const parseDataV1 = (dataString) => {
    const values = dataString.split(/\s+/); // Split by one or more whitespace characters
    const waterLevel = parseInt(values[1]);
    setWater(waterLevel);
    const flowRate = parseInt(values[2].split(':')[1]);
    setFlow(flowRate);
    const temperature = parseInt(values[3].split(':')[1]);
    setTemp(temperature);
  };

  const handleIntervalChange = (event) => {
    clearInterval(intervalRef.current);
    const newInterval = parseInt(event.target.value);
    setIntervalRef(setInterval(fetchData, newInterval));
  };

  return (
    <div>
      <div className="status-box">
        <h2>Device Status</h2>
        <p className={deviceStatus === 'Online' ? 'online' : 'offline'}>{deviceStatus}</p>
        <p>Set Refresh Interval</p>
        <div className="status-dropdown">
          <select onChange={handleIntervalChange} defaultValue="5000">
            <option value="1000">1 Second</option>
            <option value="5000">5 Seconds</option>
            <option value="10000">10 Seconds</option>
            <option value="20000">20 Seconds</option>
            <option value="30000">30 Seconds</option>
            <option value="60000">1 Minute</option>
          </select>
        </div>
      </div>
      <div className="container">
        <div className="box">
          <h2>Gas</h2>
          <CircularProgressbar value={dataV0.gas} maxValue={100} text={`${dataV0.gas}%`} />
        </div>
        <div className="box">
          <h2>TDS</h2>
          <CircularProgressbar value={dataV0.tds} maxValue={100} text={`${dataV0.tds}%`} />
        </div>
        <div className="box">
          <h2>pH</h2>
          <CircularProgressbar value={dataV0.pH} maxValue={14} text={`${dataV0.pH}`} />
        </div>
        <div className="box">
          <h2>Water Level</h2>
          <CircularProgressbar value={water} maxValue={100} text={`${water}%`} />
        </div>
        <div className="box">
          <h2>Flow Rate</h2>
          <CircularProgressbar value={flow} maxValue={100} text={`${flow} RPM`} />
        </div>
        <div className="box">
          <h2>Temperature</h2>
          <CircularProgressbar value={temp} maxValue={100} text={`${temp}°C`} />
        </div>
      </div>
    </div>
  );
};

export default App;
