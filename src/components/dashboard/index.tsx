import { useEffect, useState } from "react";
import Modal from "../../objects/modal";
import Staff from "../staff";
import "./style.css";
import Operador from "../operador";
import { useCookies } from "react-cookie";

function Dashboard() {
  const [cookies] = useCookies([
    "nome",
    "cargo",
    "login",
    "matricula",
    "super",
    "gestor",
  ]);
  const [logado] = useState({
    nome: cookies.nome,
    matricula: cookies.matricula,
    login: cookies.login,
    cargo: cookies.cargo,
    super: cookies.super,
    gestor: cookies.gestor,
  });
  const [subordinados, setSubordinados] = useState([
    { avaliacao: false, nome: "", matricula: 0 },
  ]);

  const [modal_avaliacao, setModalAvaliacao] = useState(false);
  const [nomeAlvo, setNomeAlvo] = useState("");
  const [matriculaAlvo, setMatriculaAlvo] = useState(0);
  const [mes, setMes] = useState("");
  // const [ano, setAno] = useState('');
  const [avaliacoes, setAvaliacoes] = useState({
    media_das_notas: 0.0,
    notas_media_por_questao: {
      "Alcance de metas e produtividade da equipe": 0,
      "Capacidade de adaptação e mudança": 0,
      "Capacidade de inovação e melhorias nos processos": 0,
      "Capacidade de liderança e gestão de equipes": 0,
      "Capacidade de solucionar conflitos internos": 0,
      "Comprometimento com metas e prazos": 0,
      "Comunicação clara e objetiva": 0,
      "Gestão eficiente do time e delegação de tarefas": 0,
      "Iniciativa e proatividade": 0,
      "Organização e planejamento estratégico": 0,
      "Relacionamento interpessoal": 0,
      "Resolução de problemas e tomada de decisões": 0,
      "Trabalho em equipe e colaboração": 0,
    },
  });

  const [subordinadosFiltrados, setSubordinadosFiltrados] = useState([
    { avaliacao: false, nome: "", matricula: 0 },
  ]);

  const filtrar = (value: string) => {
    setSubordinadosFiltrados(
      subordinados.filter((sub) =>
        sub.nome.toLowerCase().includes(value.toLowerCase()),
      ),
    );
    if (
      subordinadosFiltrados.length === 0 ||
      subordinadosFiltrados[0].nome === "Nenhum nome correspondente encontrado"
    ) {
      setSubordinadosFiltrados([
        {
          avaliacao: true,
          nome: "Nenhum nome correspondente encontrado",
          matricula: 0,
        },
      ]);
    }
    if (value === "") {
      setSubordinadosFiltrados(subordinados);
    }
  };

  if (!cookies.nome) {
    window.location.href = "/";
  }
  const api = "http://172.32.1.81/playground1/api/";
  useEffect(() => {
    fetch(
      `${api}subordinates?cargo=${logado.cargo}&login=${logado.login}&matricula=${logado.matricula}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setSubordinados(data.data);
        setSubordinadosFiltrados(data.data);
        setMes(data.mes);
        // setAno(data.ano);
      });
    fetch(
      `${api}avaliacoes?cargo=${logado.cargo}&login=${logado.login}&matricula=${logado.matricula}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setAvaliacoes(data.data);
      });
  }, []);

  console.log(logado.cargo);
  return (
    <div>
      <h5>Bem-vindo! {logado.nome}</h5>
      <h5>{mes}</h5>
      <h5>Pendentes: {subordinados.length}</h5>

      <main>
        {logado.cargo != "14936" && logado.cargo != "1066" ? (
          <div className="pai-cards">
            <span className="card">{avaliacoes.media_das_notas}</span>
            <span className="card">
              {
                avaliacoes.notas_media_por_questao[
                  "Alcance de metas e produtividade da equipe"
                ]
              }
            </span>
            <span className="card">
              {
                avaliacoes.notas_media_por_questao[
                  "Capacidade de adaptação e mudança"
                ]
              }
            </span>
            <span className="card">
              {
                avaliacoes.notas_media_por_questao[
                  "Capacidade de inovação e melhorias nos processos"
                ]
              }
            </span>
          </div>
        ) : null}

        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => filtrar(e.target.value)}
        />
        <table className={"lista-colab"}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Mes</th>
              <th>Ação/Status</th>
            </tr>
          </thead>
          <tbody>
            {subordinadosFiltrados.map((matricula) => (
              <tr key={matricula.matricula}>
                <td>{matricula.nome}</td>
                <td>{mes}</td>
                <td>
                  {matricula.avaliacao ? (
                    <button className={"avaliado"}>Avaliado</button>
                  ) : (
                    <button
                      className={"avaliar"}
                      onClick={() => {
                        setNomeAlvo(matricula.nome);
                        setMatriculaAlvo(matricula.matricula);
                        setModalAvaliacao(true);
                      }}
                    >
                      Avaliar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {logado.cargo != "14936" && logado.cargo != "1066" ? (
        <Modal
          isOpen={modal_avaliacao}
          onClose={() => setModalAvaliacao(false)}
          children={<Staff matricula={matriculaAlvo} nome={nomeAlvo} />}
        />
      ) : (
        <Modal
          isOpen={modal_avaliacao}
          onClose={() => setModalAvaliacao(false)}
          children={<Operador matricula={matriculaAlvo} nome={nomeAlvo} />}
        />
      )}
    </div>
  );
}

export default Dashboard;
