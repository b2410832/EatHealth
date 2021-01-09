import { PieChart } from "react-minimal-pie-chart";

const Chart = ({ color, percentage }) => {
  return (
    <PieChart
      data={[{ value: percentage, key: 1, color }]}
      reveal={percentage}
      lineWidth={20}
      startAngle={270}
      viewBoxSize={[150, 150]}
      background="#e0e0e0"
      lengthAngle={360}
      labelPosition={0}
      rounded
      animate
      center={[75, 75]}
      animationDuration={2000}
      label={({ dataEntry }) => Math.round(dataEntry.value) + "%"}
      labelStyle={{ fontWeight: "bold", fontSize: "14px" }}
    />
  );
};

export default Chart;
