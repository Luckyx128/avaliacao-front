import { useState } from "react";
import Table from "../../objects/tables";
import {useCookies} from "react-cookie";

interface OperadorProps {
    nome: string;
    matricula: number;
}
export default function Operador(props: OperadorProps) {
    const [positivos] = useState('');
    const [negativos] = useState('');
const [respostas, setRespostas] = useState({
    'Clareza na comunicação e orientação da equipe': { 'comentar': '', 'nota': 0 },
    'Disponibilidade para ouvir e dar suporte': { 'comentar':'', 'nota':0},
    'Respeito e postura profissional': { 'comentar':'', 'nota':0},
    'Capacidade de motivar e engajar a equipe': { 'comentar':'', 'nota':0}
  });
    const [cookies] = useCookies(['nome', 'cargo', 'login', 'matricula', 'super', 'gestor']);

  const handleRespostaChange = (pergunta: string, comentario: string, nota: number) => {
    console.log(pergunta, comentario, nota);
    setRespostas(prevRespostas => ({
      ...prevRespostas,
      [pergunta]: { comentar: comentario, nota: nota }
    }));
  };
    const api = 'http://10.98.14.42/playground1/api/';
const perguntas1 = [
    'Clareza na comunicação e orientação da equipe',
    'Disponibilidade para ouvir e dar suporte',
    'Respeito e postura profissional',
    'Capacidade de motivar e engajar a equipe',
  ];

    const enviarAvaliacao = () => {
        const data = {
            matricula: props.matricula,
            respostas,
            positivos,
            negativos,
            cargo: cookies.cargo,
            gestor: cookies.super,
        }

        fetch(api + 'salvar_avaliacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(() => window.location.reload())
            .catch(error => console.error(error));

    }

  return (
    <div>
        <h1>Avaliação de Funcionários</h1>
        Fevereiro
        <br/>
        {props.nome}
        <section>
            <input id='matricula' className='off' name='matricula' value={props.matricula} />
            {/* <Input id="staff-role" label="Cargo:" setValue={setCargo} /> */}
            <input id='periodo' className='off' name='periodo' value='fevereiro' />
            {/* <Input id="staff-period" label="Período de Avaliação:" setValue={setPeriodo} /> */}
        </section>
      <Table perguntas={perguntas1} resposta={respostas} onRespostaChange={handleRespostaChange} />
        <button onClick={enviarAvaliacao}>Salvar</button>
    </div>
  );
}

