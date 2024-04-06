import { Button } from "@mui/material";

function StockButtonGroup() {
  return (
    <div className="StockButtonGroup">
      <Button variant="contained" size="large" color="success">
        BUY
      </Button>
      <Button variant="contained" size="large">
        SELL
      </Button>
    </div>
  );
}

export default StockButtonGroup;
