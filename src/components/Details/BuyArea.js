import {
  Button,
  FormControl,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import { useContext, useState } from "react";
import StockContext from "../../lib/context";

function BuyArea() {
  const { setStockPicks, btcData, ethData, mkrData, setCashStack } =
    useContext(StockContext);
  const [stockToBuy, setStockToBuy] = useState([]);
  const [shares, setShares] = useState(0);
  const [dollarsInvested, setDollarsInvested] = useState(0);

  const fetchState = {
    "BINANCE:BTCUSDT": btcData,
    "BINANCE:ETHUSDT": ethData,
    "BINANCE:MKRUSDT": mkrData,
  };

  function buttonPressBuy() {
    const stockState = fetchState[stockToBuy];
    const purchasePrice = stockState[stockState.length - 1];
    setStockPicks((prevStockPicks) => {
      return [
        ...prevStockPicks,
        {
          id: stockToBuy + Date.now(),
          symbol: stockToBuy,
          shares: shares,
          dollarsInvested: dollarsInvested,
          purchasePrice: purchasePrice,
        },
      ];
    });
    setCashStack((prevCashStack) => {
      const amtSpending = purchasePrice * shares;
      return prevCashStack - amtSpending;
    });
    // Reset Input Values
    setStockToBuy([]);
    setShares(0);
    setDollarsInvested(0);
  }

  return (
    <div className="BuyArea">
      <FormControl
        className="FormControlBuyArea"
        sx={{
          m: 1,
          padding: "1rem 1.5rem",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Stock</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="BTC"
            name="radio-buttons-group"
            onChange={(e) => setStockToBuy(e.target.value)}
            value={stockToBuy}
          >
            <FormControlLabel
              value="BINANCE:BTCUSDT"
              control={<Radio />}
              label="BTC"
            />
            <FormControlLabel
              value="BINANCE:ETHUSDT"
              control={<Radio />}
              label="ETH"
            />
            <FormControlLabel
              value="BINANCE:MKRUSDT"
              control={<Radio />}
              label="MKR"
            />
          </RadioGroup>
        </FormControl>
        <TextField
          label="Shares..."
          variant="outlined"
          onChange={(e) => setShares(Number(e.target.value))}
          value={shares}
        />
        {/* <TextField
          onChange={(e) => setDollarsInvested(Number(e.target.value))}
          label="$ Investing..."
          variant="outlined"
        /> */}

        <Button
          variant="contained"
          size="large"
          color="success"
          onClick={buttonPressBuy}
        >
          BUY
        </Button>
      </FormControl>
    </div>
  );
}

export default BuyArea;
