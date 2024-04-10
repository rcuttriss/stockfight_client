import { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import StockContext from "../../lib/context";
import clsx from "clsx";
import { Button } from "@mui/material";

export default function StockTable() {
  const { btcData, ethData, mkrData, stockPicks, setStockPicks, setCashStack } =
    useContext(StockContext);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [sellAmt, setSellAmt] = useState(0);
  const [profit, setProfit] = useState(0);
  const fetchState = {
    "BINANCE:BTCUSDT": btcData,
    "BINANCE:ETHUSDT": ethData,
    "BINANCE:MKRUSDT": mkrData,
  };

  function calculateSelectedSellAmt(portfolio, target_ids) {
    let total_profit = 0;
    for (const stock of portfolio) {
      if (target_ids.includes(stock.id)) {
        const currentPrice =
          fetchState[stock.symbol][fetchState[stock.symbol].length - 1];
        total_profit += currentPrice * stock.shares;
      }
    }
    return total_profit;
  }

  function calculateSelectedProfit(portfolio, target_ids) {
    let stock_profit = 0;
    for (const stock of portfolio) {
      if (target_ids.includes(stock.id)) {
        const currentPrice =
          fetchState[stock.symbol][fetchState[stock.symbol].length - 1];
        let profit_per_share = currentPrice - stock.purchasePrice;
        stock_profit += profit_per_share * stock.shares;
      }
    }
    return stock_profit;
  }

  function buttonPressSell() {
    setCashStack((prevCashStack) => {
      return prevCashStack + sellAmt;
    });
    setStockPicks((prevStockPicks) => {
      return prevStockPicks.filter((stock) => {
        // Keep stocks whose IDs are NOT in rowSelectionModel
        return !rowSelectionModel.includes(stock.id);
      });
    });
  }

  const columns = [
    { field: "symbol", headerName: "Symbol", width: 200 },
    { field: "shares", headerName: "Shares", type: "number", width: 100 },
    {
      field: "dollarsInvested",
      headerName: "Amount Invested",
      type: "number",
      width: 130,
      valueGetter: (value, row) => {
        return row.shares * row.purchasePrice;
      },
    },
    {
      field: "purchasePrice",
      headerName: "Purchase Price",
      type: "number",
      width: 130,
    },
    {
      field: "currentPrice",
      headerName: "Current Price",
      type: "number",
      width: 130,
      valueGetter: (value, row) => {
        switch (row.symbol) {
          case "BINANCE:BTCUSDT":
            return btcData[btcData.length - 1];
          case "BINANCE:ETHUSDT":
            return ethData[ethData.length - 1];
          case "BINANCE:MKRUSDT":
            return mkrData[mkrData.length - 1];
          default:
            return 0;
        }
      },
    },
    {
      field: "totalProfit",
      headerName: "Total Profit",
      type: "number",
      cellClassName: (params) =>
        clsx({
          negative: params.value < 0,
          positive: params.value > 0,
        }),
      width: 130,
      valueGetter: (value, row) => {
        const stockState = fetchState[row.symbol];
        const currentPrice = stockState[stockState.length - 1];
        return (currentPrice - row.purchasePrice) * row.shares;
      },
    },
  ];

  useEffect(() => {
    setSellAmt(calculateSelectedSellAmt(stockPicks, rowSelectionModel));
    setProfit(calculateSelectedProfit(stockPicks, rowSelectionModel));
  }, [rowSelectionModel, btcData, ethData, mkrData]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        maxHeight: 400,
        backgroundColor: "white",
      }}
    >
      <DataGrid
        rows={stockPicks}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        pageSizeOptions={[5]}
        autoHeight={false}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
      />
      <div className="sellPreview">
        <span>
          Selling {rowSelectionModel.length} rows for ${sellAmt.toFixed(2)} with{" "}
          ${profit.toFixed(2)} profit
        </span>
        <Button
          variant="contained"
          size="large"
          color="error"
          onClick={buttonPressSell}
        >
          SELL
        </Button>
      </div>
    </div>
  );
}
