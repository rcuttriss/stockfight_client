import { useState } from "react";
import StockContext from "./lib/context";
import ChartBox from "./components/Chart/ChartBox";
import Details from "./components/Details/Details";

const App = () => {
  const [btcData, setBtcData] = useState([]);
  const [ethData, setEthData] = useState([]);
  const [mkrData, setMkrData] = useState([]);

  return (
    <StockContext.Provider
      value={{ btcData, setBtcData, ethData, setEthData, mkrData, setMkrData }}
    >
      <ChartBox />
      <Details />
    </StockContext.Provider>
  );
};

export default App;
