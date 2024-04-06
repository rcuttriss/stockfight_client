import DataGridStock from "./DataGrid";
import StockButtonGroup from "./StockButtons/StockButtonGroup";

function Details() {
  return (
    <div className="Details">
      <DataGridStock></DataGridStock>
      <StockButtonGroup></StockButtonGroup>
    </div>
  );
}

export default Details;
