// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function MostSubscribedUsersChart({ subsCount, userLabels }) {
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//   };

//   const data = {
//     labels: userLabels,
//     datasets: [
//       {
//         label: "Dataset 1",
//         data: subsCount,
//         backgroundColor: "#4790e5",
//       },
//     ],
//   };

//   return <Bar options={options} data={data} />;
// }

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function MostSubscribedUsersChart({ usersData, screenWidth }) {
  const [data, setdata] = useState([]);

  useEffect(() => {
    // setdata(
    //   usersData.map((data) => {
    //     return {
    //       data
    //     };
    //   })
    // );
    setdata(usersData)

    console.log(" post data in chart screen is : ", usersData)
  }, []);

  return (
    // <ResponsiveContainer width="100%" height="100%">
    <BarChart
      width={screenWidth > 991 ? screenWidth / 2.5 : screenWidth / 1.3}
      height={
        screenWidth > 1400
          ? screenWidth / 5
          : screenWidth > 991
          ? screenWidth / 4
          : screenWidth > 767
          ? screenWidth / 3
          : screenWidth / 2
      }
      data={data}
      // margin={{
      //   top: 5,
      //   right: 30,
      //   left: 20,
      //   bottom: 5,
      // }}
    >
      <XAxis dataKey="user" tickLine={false} axisLine={false} />
      <YAxis
        allowDecimals={false}
        tickLine={false}
        axisLine={false}
        color={"white"}
        fill={"white"}
      />

      {/* <Bar
        dataKey="subscribersCount"
        fill="#4790e5"
        radius={15}
        background={{ fill: "rgba(202, 200, 200, 0.1)", radius: 15 }}
        barSize={screenWidth / 60}
      /> */}
      <defs>
        <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9b59b6" />
          <stop offset="50%" stopColor="#3d2457" />
          <stop offset="100%" stopColor="#29183a" />
        </linearGradient>{" "}
      </defs>
      <Bar
        dataKey="postcount"
        fill="#8884d8"
        radius={15}
        background={{ fill: "rgba(202, 200, 200, 0.2)", radius: 15 }}
        barSize={screenWidth / 60}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-1`} fill={`url(#gradientColor)`} />
        ))}
      </Bar>
    </BarChart>
    // </ResponsiveContainer>
  );
}
