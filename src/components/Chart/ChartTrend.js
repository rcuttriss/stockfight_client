import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveIcon from "@mui/icons-material/Remove";

function ChartTrend({ stockData, MAX_CHART_LENGTH }) {
  const trendLast =
    stockData.length > 1
      ? stockData[stockData.length - 1] - stockData[stockData.length - 2]
      : 0;
  const trendFar =
    stockData.length >= MAX_CHART_LENGTH
      ? stockData[stockData.length - 1] - stockData[stockData.length - 59]
      : 0;

  return (
    <div className="ChartTrend">
      <div>Current: ${stockData[stockData.length - 1]}</div>
      <div className="TrendIcon">
        Last: {trendLast > 0 && <ArrowDropUpIcon color="success" />}
        {trendLast < 0 && <ArrowDropDownIcon color="error" />}
        {trendLast === 0 && <RemoveIcon />}${trendLast.toFixed(2)}
      </div>
      <div className="TrendIcon">
        {stockData.length >= MAX_CHART_LENGTH && (
          <>
            {"Last " + MAX_CHART_LENGTH}
            {trendFar > 0 && <ArrowDropUpIcon color="success" />}
            {trendFar < 0 && <ArrowDropDownIcon color="error" />}
            {trendFar === 0 && <RemoveIcon />}${trendFar.toFixed(2)}
          </>
        )}
      </div>
    </div>
  );
}

export default ChartTrend;
