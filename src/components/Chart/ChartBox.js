import ChartComponent from "./Chart";
import StockContext from "../../lib/context";
import { useContext } from "react";

function ChartBox() {
  const { btcData, setBtcData, ethData, setEthData, mkrData, setMkrData } =
    useContext(StockContext);
  return (
    <div className="ChartBox">
      <ChartComponent
        className="Chart"
        symbol="BINANCE:BTCUSDT"
        stockData={btcData}
        setStockData={setBtcData}
      ></ChartComponent>
      <ChartComponent
        className="Chart"
        symbol="BINANCE:ETHUSDT"
        stockData={ethData}
        setStockData={setEthData}
      ></ChartComponent>
      <ChartComponent
        className="Chart"
        symbol="BINANCE:MKRUSDT"
        stockData={mkrData}
        setStockData={setMkrData}
      ></ChartComponent>
    </div>
  );
}

export default ChartBox;
