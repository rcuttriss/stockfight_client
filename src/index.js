import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ChartComponent from "./components/Chart/Chart";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div className="ChartBox">
    {/* <div className="Chart">bigman</div>
    <div className="Chart">bigman</div>
    <div className="Chart">bigman</div> */}
    <ChartComponent className="Chart" symbol="BINANCE:BTCUSDT"></ChartComponent>
    <ChartComponent className="Chart" symbol="BINANCE:ETHUSDT"></ChartComponent>
    <ChartComponent className="Chart" symbol="BINANCE:MKRUSDT"></ChartComponent>
  </div>
);
