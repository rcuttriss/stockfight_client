import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import io from "socket.io-client";
import "./Chart.css";

const WEBSOCKET_API_URL = "http://localhost:3001"; // Replace with your API URL

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function convertUnixMsToTime(unixMs) {
  // Create a new Date object from the milliseconds
  const date = new Date(unixMs);

  // Options for formatting (adjust as needed)
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  // Format the date according to the options
  const formattedTime = date.toLocaleString("en-US", options);

  return formattedTime;
}

const StockChart = () => {
  const [timestamps, setTimeStamps] = useState([]);
  const [prices, setPrices] = useState([]);
  const [minPrice, setMinPrice] = useState(Infinity); // Initialize to positive infinity
  const [maxPrice, setMaxPrice] = useState(-Infinity); // Initialize to negative infinity

  const socket = io(WEBSOCKET_API_URL); // Replace with your server's URL

  useEffect(() => {
    socket.on("connection", (socket) => {
      console.log("React Client connected to Express server");
    });

    socket.on("finnhub-data", (data) => {
      if (data === undefined) {
        return;
      }
      // Process the received data from Finnhub
      const newTimestamps = data["data"].map((item) =>
        convertUnixMsToTime(item.t)
      );
      const newPrices = data["data"].map((item) => item.p);

      // Update state with splicing and minimum/maximum tracking
      setTimeStamps([
        ...timestamps.slice(0, 50 - newTimestamps.length),
        ...newTimestamps,
      ]);
      setPrices([...prices, ...newPrices]);
    });
  }, []);

  useEffect(() => {
    // Update min and max price based on current prices
    console.log(prices);
    setMinPrice(Math.min(...prices));
    setMaxPrice(Math.max(...prices));
  }, [prices]);

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: "BINANCE:BTCUSDT",
        data: prices.map(
          (price) => ((price - minPrice) / (maxPrice - minPrice)) * 100
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  return (
    <div className="chart">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
