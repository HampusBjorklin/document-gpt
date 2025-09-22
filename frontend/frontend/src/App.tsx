import { useState, useEffect } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import { InputContainer } from "./components/input"; // Updated import path

interface HealthResponse {
  status: string;
}

const App: FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axios.get<HealthResponse>('http://localhost:8000/api/health/');
        setHealthStatus(response.data.status);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setHealthStatus('Failed to connect');
      }
    };
    fetchHealth();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString()); // includes seconds
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        papr.dev
        <div className="header-right">
          <span className="clock">{time}</span>
          <span
            className={`status-indicator ${healthStatus === 'OK' && !error ? 'live' : ''}`}
            title={healthStatus}
          />
        </div>
      </div>

      <div className="body-wrapper">

        <div className="left-panel">
          <InputContainer />
        </div>

        <div className="right-panel">
          <p>Output</p>
        </div>

      </div>
    </div>
  );
};

export default App;