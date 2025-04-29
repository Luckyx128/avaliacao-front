import './style.css'

type Assunto = {
  assunto: string;
  total: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export default function TableComponent({ data }: { data: Assunto[] }) {

   return (
      <table>
         <thead>
         <tr>
            <th>Assunto</th>
            <th>Total</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Nota 3</th>
            <th>Nota 4</th>
            <th>Nota 5</th>
         </tr>
         </thead>
         <tbody>
         {data.map((item, index) => (
            <tr key={index}>
               <td>{item.assunto}</td>
               <td>{item.total}</td>
               <td>{item[1]}</td>
               <td>{item[2]}</td>
               <td>{item[3]}</td>
               <td>{item[4]}</td>
               <td>{item[5]}</td>
            </tr>
         ))}
         </tbody>
      </table>
   );
}