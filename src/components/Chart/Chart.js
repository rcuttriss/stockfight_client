import React, { useState, useEffect, useRef } from "react";
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
import "./Chart.css";
import socket from "../../socket";

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

const MAX_CHART_LENGTH = 60;
const TIME_INTERVAL_MS = 1000;

const StockChart = ({ symbol }) => {
  const [timestamps, setTimeStamps] = useState([]);
  const lastTimeStamp = useRef(0);
  const [prices, setPrices] = useState([]);
  const [minPrice, setMinPrice] = useState(Infinity); // Initialize to positive infinity
  const [maxPrice, setMaxPrice] = useState(-Infinity); // Initialize to negative infinity

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();

    socket.on("finnhub-data", (data) => {
      if (data["data"] === undefined || data["data"].length === 0) {
        return;
      }
      const bigData = data["data"].filter((item) => item.s === symbol);
      let prunedTimeStamps = [];
      let prunedPrices = [];

      for (const element of bigData) {
        const currTime = element["t"];
        const currPrice = element["p"];

        if (currTime - lastTimeStamp.current >= TIME_INTERVAL_MS) {
          lastTimeStamp.current = currTime;
          prunedTimeStamps.push(convertUnixMsToTime(currTime));
          prunedPrices.push(currPrice);

          setMinPrice((prevMin) => Math.min(prevMin, currPrice));
          setMaxPrice((prevMax) => Math.max(prevMax, currPrice));
        }
      }

      setTimeStamps((prevTimestamps) => {
        const combinedLength = prevTimestamps.length + prunedTimeStamps.length;
        if (combinedLength > MAX_CHART_LENGTH) {
          const sliceAmount = combinedLength - MAX_CHART_LENGTH;
          const prevTimestampsSliced = prevTimestamps.slice(sliceAmount);
          return [...prevTimestampsSliced, ...prunedTimeStamps];
        } else {
          return [...prevTimestamps, ...prunedTimeStamps];
        }
      });

      setPrices((prevPrices) => {
        const combinedLength = prevPrices.length + prunedPrices.length;
        if (combinedLength > MAX_CHART_LENGTH) {
          const sliceAmount = combinedLength - MAX_CHART_LENGTH;
          const prevPricesSliced = prevPrices.slice(sliceAmount);
          return [...prevPricesSliced, ...prunedPrices];
        } else {
          return [...prevPrices, ...prunedPrices];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: symbol,
        data: prices,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    animations: false,
    responsive: true,
    layout: {
      padding: 20,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: minPrice * 1.4,
            max: maxPrice * 1.4,
          },
        },
      ],
    },
  };

  return (
    <div className="Chart">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
