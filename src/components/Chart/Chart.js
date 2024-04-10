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
import socket from "../../lib/socket";
import ChartTrend from "./ChartTrend";

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

const StockChart = ({ symbol, stockData, setStockData }) => {
  const [timestamps, setTimestamps] = useState([]);
  const lastTimeStamp = useRef(0);

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();

    socket.on("finnhub-data", (data) => {
      if (data["data"] === undefined || data["data"].length === 0) {
        return;
      }

      // filter by symbol
      const bigData = data["data"].filter((item) => item.s === symbol);
      let prunedTimeStamps = [];
      let prunedPrices = [];

      // prune the incoming data to only show a data point every TIME_INTERVAL_MS
      for (const element of bigData) {
        const currTime = element["t"];
        const currPrice = element["p"];

        if (currTime - lastTimeStamp.current >= TIME_INTERVAL_MS) {
          lastTimeStamp.current = currTime;
          prunedTimeStamps.push(convertUnixMsToTime(currTime));
          prunedPrices.push(currPrice);
        }
      }

      // set timeStamps and prices, slicing old data to keep max data points at MAX_CHART_LENGTH
      setTimestamps((prevTimestamps) => {
        const combinedLength = prevTimestamps.length + prunedTimeStamps.length;
        if (combinedLength > MAX_CHART_LENGTH) {
          const sliceAmount = combinedLength - MAX_CHART_LENGTH;
          const prevTimestampsSliced = prevTimestamps.slice(sliceAmount);
          return [...prevTimestampsSliced, ...prunedTimeStamps];
        } else {
          return [...prevTimestamps, ...prunedTimeStamps];
        }
      });

      setStockData((prevPrices) => {
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
        data: stockData,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    animations: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="Chart">
      <Line data={chartData} options={options} width={368} />
      <ChartTrend
        stockData={stockData}
        MAX_CHART_LENGTH={MAX_CHART_LENGTH}
      ></ChartTrend>
    </div>
  );
};

export default StockChart;
