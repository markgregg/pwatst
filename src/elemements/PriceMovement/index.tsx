import Chart from "chart.js/auto";
import { ChartData } from "chart.js/dist/types/index";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import {CategoryScale} from 'chart.js'; 
import "./PriceMovement.css";

Chart.register(CategoryScale);

const PriceMovement = () => {
  const [data,setData] = useState<ChartData<'line',number[],string>>();
  const activePosition = useSelector((state: RootState) => state);
  
  useEffect(() => {
    
    setData({
      labels: ["T-7", "T-6", "T-5", "T-4", "T-3", "T-2", "T-1"],
      datasets: [
        {
          label: "Last 7 days",
          backgroundColor: "black",
          borderColor: "darkgray",
          data: activePosition?.position.oneWeek ?? [],
        },
      ],
    });
  },[activePosition])
  
  return (
    <div className="priceMovement">
      {
        data != null && <Line data={data} />
      }
    </div>
  );
}

export default PriceMovement;