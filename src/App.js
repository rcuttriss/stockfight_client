import { useState } from "react";
import StockContext from "./lib/context";
import ChartBox from "./components/Chart/ChartBox";
import Details from "./components/Details/Details";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./lib/MUItheme";

const App = () => {
  const [btcData, setBtcData] = useState([]);
  const [ethData, setEthData] = useState([]);
  const [mkrData, setMkrData] = useState([]);

  const [stockPicks, setStockPicks] = useState([]);
  const [cashStack, setCashStack] = useState(100000);
  return (
    <ThemeProvider theme={theme}>
      <StockContext.Provider
        value={{
          btcData,
          setBtcData,
          ethData,
          setEthData,
          mkrData,
          setMkrData,
          stockPicks,
          setStockPicks,
          cashStack,
          setCashStack,
        }}
      >
        <ChartBox />
        <Details />
      </StockContext.Provider>
    </ThemeProvider>
  );
};

export default App;
