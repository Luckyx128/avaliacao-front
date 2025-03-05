import { useEffect, useState } from "react";
import Modal from "../../objects/modal";
import Staff from "../staff";
import Operador from "../operador";
import "./style.css";
import { useCookies } from "react-cookie";
import {
  ExcelOperador,
  ExportExcelFromAPI,
  ExcelPreview,
} from "../../objects/excel";
import type { OperadorType } from "../../objects/excel";
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
    { avaliacao: false, nome: "", matricula: 0, login: "" },
  ]);

  const [modal_avaliacao, setModalAvaliacao] = useState(false);
  const [modal_excel, setModalExcel] = useState(false);
  const [nomeAlvo, setNomeAlvo] = useState("");
  const [matriculaAlvo, setMatriculaAlvo] = useState(0);
  const [mes, setMes] = useState("");
  const [cardOpen, setCardOpen] = useState(false);
  // const [ano, setAno] = useState('');
  const [avaliacoes, setAvaliacoes] = useState({
    media_das_notas: 0.0,
    notas_media_por_questao: {
      "Alcance de metas e produtividade da equipe": 0.0,
      "Capacidade de adaptação e mudança": 0.0,
      "Capacidade de inovação e melhorias nos processos": 0.0,
      "Capacidade de liderança e gestão de equipes": 0.0,
      "Capacidade de solucionar conflitos internos": 0.0,
      "Comprometimento com metas e prazos": 0.0,
      "Comunicação clara e objetiva": 0.0,
      "Gestão eficiente do time e delegação de tarefas": 0.0,
      "Iniciativa e proatividade": 0.0,
      "Organização e planejamento estratégico": 0.0,
      "Relacionamento interpessoal": 0.0,
      "Resolução de problemas e tomada de decisões": 0.0,
      "Trabalho em equipe e colaboração": 0.0,
    },
    avaliados: [
      {
        ano: "2025",
        id: 10,
        matricula: "114467",
        nome: "John Doe",
        mes: "Março",
        negativos: "asdas",
        positivos: "adsd",
        respostas: {
          "Comprometimento com metas e prazos": { comentar: "", nota: 1 },
          "Capacidade de liderança e gestão de equipes": {
            comentar: "",
            nota: 2,
          },
          "Comunicação clara e objetiva": { comentar: "", nota: 8 },
          "Resolução de problemas e tomada de decisões": {
            comentar: "",
            nota: 4,
          },
          "Trabalho em equipe e colaboração": { comentar: "", nota: 5 },
          "Relacionamento interpessoal": { comentar: "", nota: 5 },
          "Capacidade de adaptação e mudança": { comentar: "", nota: 5 },
          "Iniciativa e proatividade": { comentar: "", nota: 6 },
          "Alcance de metas e produtividade da equipe": {
            comentar: "",
            nota: 1,
          },
          "Gestão eficiente do time e delegação de tarefas": {
            comentar: "",
            nota: 5,
          },
          "Capacidade de solucionar conflitos internos": {
            comentar: "",
            nota: 8,
          },
          "Organização e planejamento estratégico": { comentar: "", nota: 5 },
          "Capacidade de inovação e melhorias nos processos": {
            comentar: "",
            nota: 5,
          },
        },
      },
    ],
  });

  const [subordinadosFiltrados, setSubordinadosFiltrados] = useState([
    { avaliacao: false, nome: "", matricula: 0, login: "" },
  ]);
  const [listaAvaliacoes, setListaAvaliacoes] = useState<OperadorType[]>([]);
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
          login: "",
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

  const api = import.meta.env.VITE_HOST_API;
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
        if (data.data.media_das_notas !== 0) {
          setAvaliacoes(data.data);
        }
      });
  }, []);

  return (
    <div>
      <h4>Bem-vindo! {logado.nome}</h4>
      <h4>{mes}</h4>
      <h4>Todal: {subordinados.length}</h4>

      <main>
        {logado.cargo != "14936" && logado.cargo != "1066" ? (
          <>
            <ExportExcelFromAPI
              nome={logado.nome}
              avaliados={avaliacoes.avaliados}
            />

            <span className="card geral" onClick={() => setCardOpen(!cardOpen)}>
              <p>Média geral</p>
              {avaliacoes.media_das_notas}
            </span>
            <div className={`pai-cards ${cardOpen ? "open" : "close"}`}>
              <span className="card">
                <p>Alcance de metas ...</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Alcance de metas e produtividade da equipe"
                  ]
                }
              </span>
              <span className="card">
                <p>Adaptabilidade</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Capacidade de adaptação e mudança"
                  ]
                }
              </span>
              <span className="card">
                <p>Inovação</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Capacidade de inovação e melhorias nos processos"
                  ]
                }
              </span>
              <span className="card">
                <p>Liderança</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Capacidade de liderança e gestão de equipes"
                  ]
                }
              </span>
              <span className="card">
                <p>Solução de conflitos</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Capacidade de solucionar conflitos internos"
                  ]
                }
              </span>
              <span className="card">
                <p>Metas e prazos</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Comprometimento com metas e prazos"
                  ]
                }
              </span>
              <span className="card">
                <p>Comunicação clara e objetiva</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Comunicação clara e objetiva"
                  ]
                }
              </span>
              <span className="card">
                <p>Gestão eficiente e delegação de tarefas</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Gestão eficiente do time e delegação de tarefas"
                  ]
                }
              </span>
              <span className="card">
                <p>Iniciativa e proatividade</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Iniciativa e proatividade"
                  ]
                }
              </span>
              <span className="card">
                <p>Organização e planejamento estratégico</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Organização e planejamento estratégico"
                  ]
                }
              </span>
              <span className="card">
                <p>Relacionamento interpessoal</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Relacionamento interpessoal"
                  ]
                }
              </span>
              <span className="card">
                <p>Resolução de problemas e tomada de decisões</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Resolução de problemas e tomada de decisões"
                  ]
                }
              </span>
              <span className="card">
                <p>Trabalho em equipe e colaboração</p>
                {
                  avaliacoes.notas_media_por_questao[
                    "Trabalho em equipe e colaboração"
                  ]
                }
              </span>
            </div>
          </>
        ) : null}

        <input
          className="search-input"
          type="text"
          placeholder="Procurar colaborador"
          onChange={(e) => filtrar(e.target.value)}
        />
        <table className={"lista-colab"}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Mes</th>
              <th>Ação/Status</th>
              {logado.cargo != "14936" && logado.cargo != "1066" ? (
                <th>Extrair</th>
              ) : null}
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
                <td>
                  {logado.cargo != "14936" && logado.cargo != "1066" ? (
                    <ExcelOperador
                      setNomeAlvo={setNomeAlvo}
                      setModalVisible={setModalExcel}
                      setListaAvaliacoes={setListaAvaliacoes}
                      nome={matricula.nome}
                      login={matricula.login}
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {logado.cargo != "14936" && logado.cargo != "1066" ? (
        <>
          <Modal
            isOpen={modal_avaliacao}
            onClose={() => setModalAvaliacao(false)}
            children={<Staff matricula={matriculaAlvo} nome={nomeAlvo} />}
          />
          <Modal
            isOpen={modal_excel}
            onClose={() => setModalExcel(false)}
            children={
              <ExcelPreview
                nome={nomeAlvo}
                lista_avaliacoes={listaAvaliacoes}
              />
            }
          />
        </>
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
