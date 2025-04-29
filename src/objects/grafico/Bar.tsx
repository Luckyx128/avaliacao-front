import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   LabelList
 } from "recharts";


type Assunto= {
assunto: string;
total: number;
1: number;
2: number;
3: number;
4: number;
5: number;
};

export default function BarChartComponent({ data, legend, width }: { data: Assunto[]; legend: boolean; width: number }) {

  return (
       <BarChart
            width={width}
            height={200}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="assunto" />
            <YAxis />
            <Tooltip />
            {legend && <Legend />}
            <Bar dataKey="1" fill="#8884d8" name="Nota 1" >
             <LabelList dataKey="1" position="top" />
           
            </Bar>
            <Bar dataKey="2" fill="#82ca9d" name="Nota 2" >
           <LabelList dataKey="2" position="top" />
           </Bar>
            <Bar dataKey="3" fill="#ffc658" name="Nota 3" >
           <LabelList dataKey="3" position="top" />
           </Bar>
            <Bar dataKey="4" fill="#ff8042" name="Nota 4" >
           <LabelList dataKey="4" position="top" />
           </Bar>
            <Bar dataKey="5" fill="#8dd1e1" name="Nota 5" >
           <LabelList dataKey="5" position="top" />
           </Bar>
           <Bar dataKey="total" fill="#8dd1e1" name="Total" >
           <LabelList dataKey="total" position="top" />
           </Bar>
          </BarChart>
  );
}