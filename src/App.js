import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const App = () => {
  const [dataV0, setDataV0] = useState({
    gas: 0,
    tds: 0,
    pH: 0
  });

const [water,setWater] = useState(0)
const [flow,setFlow] = useState(0)
const [temp,setTemp] = useState(0)

  // const [dataV1, setDataV1] = useState({
  //   waterLevel: 0,
  //   flowRate: 0,
  //   temperature: 0
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseV0 = await fetch('https://blynk.cloud/external/api/get?token=s_Xbhek5vkqJBgudsAJkmIvVawSisYe3&V0');
        const responseV1 = await fetch('https://blynk.cloud/external/api/get?token=s_Xbhek5vkqJBgudsAJkmIvVawSisYe3&V1');
        const dataV0String = await responseV0.text();
        const dataV1String = await responseV1.text();
        setDataV0(parseDataV0(dataV0String));
        parseDataV1(dataV1String);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
    console.log(values)
    // const waterLevelIndex = values.findIndex(item => item.includes('W:'));
    const waterLevel = parseInt(values[1]);
    console.log(typeof(waterLevel))
    setWater(waterLevel)
    // const flowRateIndex = values.findIndex(item => item.includes('F:'));
    const flowRate = parseInt(values[2].split(':')[1]);
    setFlow(flowRate)
    // const temperatureIndex = values.findIndex(item => item.includes('T:'));
    const temperature = parseInt(values[3].split(':')[1]);
    setTemp(temperature)
    // return {
    //   // waterLevel: waterLevel,
    //   flowRate: flowRate,
    //   // temperature: temperature
    // };
  };
  
  return (
    <div>
      <div>
        <h2>Gas</h2>
        <CircularProgressbar value={dataV0.gas} maxValue={100} text={`${dataV0.gas}%`} />
      </div>
      <div>
        <h2>TDS</h2>
        <CircularProgressbar value={dataV0.tds} maxValue={100} text={`${dataV0.tds}%`} />
      </div>
      <div>
        <h2>pH</h2>
        <CircularProgressbar value={dataV0.pH} maxValue={14} text={`${dataV0.pH}`} />
      </div>
      <div>
        <h2>Water Level</h2>
        <CircularProgressbar value={water} maxValue={100} text={`${water}%`} />
      </div>
      <div>
        <h2>Flow Rate</h2>
        <CircularProgressbar value={flow} maxValue={100} text={`${flow} RPM`} />
      </div>
      <div>
        <h2>Temperature</h2>
        <CircularProgressbar value={temp} maxValue={100} text={`${temp}°C`} />
      </div>
    </div>
  );
};

export default App;
