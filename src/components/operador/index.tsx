import { useState } from "react";
import Table from "../../objects/tables";
import { useCookies } from "react-cookie";

interface OperadorProps {
  nome: string;
  matricula: number;
}
export default function Operador(props: OperadorProps) {
  const [positivos] = useState("");
  const [negativos] = useState("");
  const [respostas, setRespostas] = useState({
    "Clareza na comunicação e orientação da equipe": { comentar: "", nota: 0 },
    "Disponibilidade para ouvir e dar suporte": { comentar: "", nota: 0 },
    "Respeito e postura profissional": { comentar: "", nota: 0 },
    "Capacidade de motivar e engajar a equipe": { comentar: "", nota: 0 },
  });
  const [cookies] = useCookies([
    "nome",
    "cargo",
    "login",
    "matricula",
    "super",
    "gestor",
  ]);

  const handleRespostaChange = (
    pergunta: string,
    comentario: string,
    nota: number,
  ) => {
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [pergunta]: { comentar: comentario, nota: nota },
    }));
  };
  const api = import.meta.env.VITE_HOST_API;
  const perguntas1 = [
    "Clareza na comunicação e orientação da equipe",
    "Disponibilidade para ouvir e dar suporte",
    "Respeito e postura profissional",
    "Capacidade de motivar e engajar a equipe",
  ];

  const enviarAvaliacao = () => {
    const data = {
      matricula: props.matricula,
      respostas,
      nome: props.nome,
      positivos,
      negativos,
      cargo: cookies.cargo,
      gestor: cookies.super,
    };

    fetch(api + "salvar_avaliacao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => window.location.reload())
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Avaliação de Funcionários</h1>
      <br />
      {props.nome}
      <section>
        <input
          id="matricula"
          className="off"
          name="matricula"
          defaultValue={props.matricula}
        />
      </section>
      <Table
        inputclass="tableInput"
        perguntas={perguntas1}
        resposta={respostas}
        onRespostaChange={handleRespostaChange}
      />
      <button onClick={enviarAvaliacao}>Salvar</button>
    </div>
  );
}
