import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StockChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('1mo');
  const [interval, setInterval] = useState('1d');

  useEffect(() => {
    const fetchChartData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${API_URL}/stocks/chart/${symbol}`, {
          params: { interval, range: timeRange }
        });
        
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError('Failed to load chart data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, timeRange, interval]);

  const handleRangeChange = (e) => {
    const range = e.target.value;
    setTimeRange(range);
    
    // Adjust interval based on range for better visualization
    if (['1d', '5d'].includes(range)) {
      setInterval('5m');
    } else if (['1mo', '3mo'].includes(range)) {
      setInterval('1d');
    } else {
      setInterval('1wk');
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!chartData || !chartData.timestamp || !chartData.indicators) {
    return <Alert variant="info">Select a stock to view chart</Alert>;
  }

  // Process chart data
  const timestamps = chartData.timestamp.map(ts => new Date(ts * 1000).toLocaleDateString());
  const prices = chartData.indicators.quote[0].close;
  
  const chartConfig = {
    labels: timestamps,
    datasets: [
      {
        label: symbol,
        data: prices,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${symbol} Stock Price Chart`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <Card className="stock-chart-card mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Price Chart</h5>
          <Form.Select 
            value={timeRange}
            onChange={handleRangeChange}
            style={{ width: 'auto' }}
          >
            <option value="1d">1 Day</option>
            <option value="5d">5 Days</option>
            <option value="1mo">1 Month</option>
            <option value="3mo">3 Months</option>
            <option value="6mo">6 Months</option>
            <option value="1y">1 Year</option>
            <option value="5y">5 Years</option>
            <option value="max">Max</option>
          </Form.Select>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="chart-container" style={{ height: '400px' }}>
          <Line data={chartConfig} options={chartOptions} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default StockChart;
