import  './style.css';

interface tabelaProps {
  perguntas: string[];
  resposta: { [key: string]: { comentar: string, nota: number } };
  onRespostaChange: (pergunta: string, comentario: string, nota: number) => void;
}

function Table(props :tabelaProps) {
  const handleComentarioChange = (pergunta: string, comentario: string) => {
    const nota = props.resposta[pergunta].nota;
    props.onRespostaChange(pergunta, comentario, nota);
  };

  const handleNotaChange = (pergunta: string, nota: number) => {
    const comentario = props.resposta[pergunta].comentar;
    props.onRespostaChange(pergunta, comentario, nota);
  };
  return (
    <table >
      <thead>
        <tr>
          <th>Critério</th>
          <th>Nota (1 a 5)	</th>
          <th>Comentários (opcional)</th>
        </tr>
      </thead>
      <tbody>
        {props.perguntas.map((pergunta:string,index:number) => (
          <tr key={index}>
            <td>{pergunta}</td>
            <td><input type="number" min="1" max="5"
            onChange={(e) => handleNotaChange(pergunta, parseInt(e.target.value))}/></td>
            <td>
              <input type="text"
              onChange={(e) => handleComentarioChange(pergunta, e.target.value)}/></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
