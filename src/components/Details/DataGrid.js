import { useContext } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import StockContext from "../../lib/context";
import clsx from "clsx";

export default function StockTable() {
  const { btcData, ethData, mkrData } = useContext(StockContext);

  const columns = [
    { field: "symbol", headerName: "Symbol", width: 200 },
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
        switch (row.symbol) {
          case "BINANCE:BTCUSDT":
            return btcData[btcData.length - 1] - row.purchasePrice;
          case "BINANCE:ETHUSDT":
            return ethData[ethData.length - 1] - row.purchasePrice;
          case "BINANCE:MKRUSDT":
            return mkrData[mkrData.length - 1] - row.purchasePrice;
          default:
            return 0;
        }
      },
    },
  ];

  const rows = [
    {
      id: 1,
      symbol: "BINANCE:BTCUSDT",
      purchasePrice: 150,
    },
    {
      id: 2,
      symbol: "BINANCE:ETHUSDT",
      purchasePrice: 1200,
    },
    { id: 3, symbol: "BINANCE:MKRUSDT", purchasePrice: 500 },
  ];

  return (
    <Box sx={{ display: "flex", width: "100%", height: "50%", margin: "auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
