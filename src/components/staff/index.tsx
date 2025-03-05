import { useState } from "react";
import { useCookies } from "react-cookie";
import { Input } from "../../objects/inputs";
import Table from "../../objects/tables";
import "./style.css";

interface StaffProps {
  nome: string;
  matricula: number;
}

function Staff(props: StaffProps) {
  const [cookies] = useCookies([
    "nome",
    "cargo",
    "login",
    "matricula",
    "super",
    "gestor",
  ]);
  const [positivos, setPositivos] = useState("");
  const [negativos, setNegativos] = useState("");
  const [respostas, setRespostas] = useState({
    "Comprometimento com metas e prazos": { comentar: "", nota: 0 },
    "Capacidade de liderança e gestão de equipes": { comentar: "", nota: 0 },
    "Comunicação clara e objetiva": { comentar: "", nota: 0 },
    "Resolução de problemas e tomada de decisões": { comentar: "", nota: 0 },
    "Trabalho em equipe e colaboração": { comentar: "", nota: 0 },
    "Relacionamento interpessoal": { comentar: "", nota: 0 },
    "Capacidade de adaptação e mudança": { comentar: "", nota: 0 },
    "Iniciativa e proatividade": { comentar: "", nota: 0 },
    "Alcance de metas e produtividade da equipe": { comentar: "", nota: 0 },
    "Gestão eficiente do time e delegação de tarefas": {
      comentar: "",
      nota: 0,
    },
    "Capacidade de solucionar conflitos internos": { comentar: "", nota: 0 },
    "Organização e planejamento estratégico": { comentar: "", nota: 0 },
    "Capacidade de inovação e melhorias nos processos": {
      comentar: "",
      nota: 0,
    },
  });
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
    "Comprometimento com metas e prazos",
    "Capacidade de liderança e gestão de equipes",
    "Comunicação clara e objetiva",
    "Resolução de problemas e tomada de decisões",
    "Trabalho em equipe e colaboração",
    "Relacionamento interpessoal",
    "Capacidade de adaptação e mudança",
    "Iniciativa e proatividade",
  ];

  const perguntas2 = [
    "Alcance de metas e produtividade da equipe",
    "Gestão eficiente do time e delegação de tarefas",
    "Capacidade de solucionar conflitos internos",
    "Organização e planejamento estratégico",
    "Capacidade de inovação e melhorias nos processos",
    "Relacionamento interpessoal",
  ];

  const enviarAvaliacao = () => {
    const data = {
      matricula: props.matricula,
      respostas,
      positivos,
      negativos,
      cargo: cookies.cargo,
      gestor: cookies.login,
      nome: props.nome,
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
      Fevereiro
      <br />
      {props.nome}
      <section>
        <input
          id="matricula"
          className="off"
          name="matricula"
          defaultValue={props.matricula}
        />
        {/* <Input id="staff-role" label="Cargo:" setValue={setCargo} /> */}
        <input
          id="periodo"
          className="off"
          name="periodo"
          defaultValue="fevereiro"
        />
        {/* <Input id="staff-period" label="Período de Avaliação:" setValue={setPeriodo} /> */}
      </section>
      <section>
        <h1>1. Auto Avaliação</h1>
        <p>
          Avalie seu próprio desempenho durante os últimos meses do,utilizando a
          escala abaixo:
        </p>
        <ul>
          <li>1 - Muito abaixo do esperado</li>
          <li>2 - Abaixo do esperado</li>
          <li>3 - Regular</li>
          <li>4 - Bom</li>
          <li>5 - Excelente</li>
        </ul>
      </section>
      <Table
        inputclass="tableInput"
        perguntas={perguntas1}
        resposta={respostas}
        onRespostaChange={handleRespostaChange}
      />
      <p>Avaliação do Lider (coordenador)</p>
      <Table
        inputclass="tableInput"
        perguntas={perguntas2}
        resposta={respostas}
        onRespostaChange={handleRespostaChange}
      />
      <section>
        <Input
          id="positive-points"
          label="Pontos positivos:"
          setValue={setPositivos}
        />
      </section>
      <section>
        <Input
          id="negative-points"
          label="Pontos a melhorar:"
          setValue={setNegativos}
        />
      </section>
      <button onClick={enviarAvaliacao}>Salvar</button>
    </div>
  );
}

export default Staff;
