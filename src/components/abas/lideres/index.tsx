import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import "./style.css";
import api from "../../../services/api";

interface Pergunta {
  id: number;
  assunto: string;
  pergunta: string;
  resposta?: number;
}

interface Supervisor {
  matricula: number;
  nome: string;
  login: string;
  avaliado: boolean;
  setor: number;
}

interface SupervisorOption {
  login: string;
  matricula: number;
  nome: string;
  avaliado: boolean;
}
type responseData = {
  message: string;
  status_code: number;
  error: string;
};
const Lideres = () => {
  const [cookies] = useCookies([
    "matricula",
    "gestor",
    "super",
    "nome",
    "cargo",
    "login",
  ]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [comentario, setComentario] = useState("");
  const [positivos, setPositivos] = useState("");
  const [negativos, setNegativos] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] =
    useState<Supervisor | null>(null);
  const [supervisorOptions, setSupervisorOptions] = useState<
    SupervisorOption[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSupervisores = async () => {
      try {
        const response = await fetch(
          `${api}list_supervisores?mat_gestor=${cookies.login}`,
        );
        const data = await response.json();
        if (data.status_code === 200) {
          setSupervisorOptions(data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar supervisores:", error);
      }
    };

    fetchSupervisores();
  }, [cookies.gestor, cookies.login]);

  const fetchPerguntas = async (setorAvaliado: number) => {
    try {
      const response = await fetch(
        `${api}questoes?tipo=3&setor=${cookies.cargo}&setorAvaliado=${setorAvaliado}`,
      );
      const data = await response.json();
      const perguntas: Pergunta[] = data.data.perguntas;
      setPerguntas(perguntas.map((p) => ({ ...p, resposta: undefined })));
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
    }
  };

  const handleSupervisorSelect = async (login: string) => {
    if (!login) {
      setSelectedSupervisor(null);
      return;
    }

    // Verificar se o supervisor já foi avaliado
    const supervisorSelecionado = supervisorOptions.find(
      (s) => s.login === login,
    );
    if (supervisorSelecionado?.avaliado) {
      Swal.fire({
        title: "Supervisor já avaliado",
        text: "Este supervisor já foi avaliado anteriormente.",
        icon: "info",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setLoading(true);
    // Limpar formulário ao trocar de supervisor
    setPerguntas(perguntas.map((p) => ({ ...p, resposta: undefined })));
    setComentario("");
    setPositivos("");
    setNegativos("");

    try {
      // Buscar dados do supervisor selecionado
      const response = await fetch(`${api}colaboradores/${login}`);
      const data = await response.json();
      setSelectedSupervisor({
        ...data.data,
        avaliado: supervisorSelecionado?.avaliado || false,
      });
      fetchPerguntas(data.data.setor); // Recarregar perguntas para o novo supervisor
    } catch (error) {
      console.error("Erro ao buscar dados do supervisor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (questionId: number, rating: number) => {
    setPerguntas(
      perguntas.map((q) =>
        q.id === questionId ? { ...q, resposta: rating } : q,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!selectedSupervisor) {
      Swal.fire({
        title: "Atenção!",
        text: "Selecione um supervisor para avaliar",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Confirmar envio?",
        text: `Você está avaliando ${selectedSupervisor.nome}. Não poderá alterar suas respostas depois.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, enviar!",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      const respostas = perguntas.map((q) => ({
        pergunta_id: q.id,
        resposta: q.resposta,
        matricula: selectedSupervisor.matricula, // Matrícula do supervisor avaliado
        gestor: cookies.gestor, // Gestor do coordenador
        super: cookies.login, //Coordenador do supervisor
        comentario: comentario,
        positivos: positivos,
        negativos: negativos,
        nome: selectedSupervisor.nome,
        tipo_id: 3,
      }));

      const response = await fetch(`${api}respostas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respostas }),
      });

      const data: responseData = await response.json();

      if (data.status_code !== 200) {
        Swal.fire({
          title: "Erro!",
          text: "Erro ao enviar avaliação",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          title: "Sucesso!",
          text: "Avaliação enviada com sucesso!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          setSelectedSupervisor(null);
          setPerguntas(perguntas.map((p) => ({ ...p, resposta: undefined })));
          setComentario("");
          setPositivos("");
          setNegativos("");
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao enviar avaliação",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <div className="autoavaliacao-container">
      <div className="autoavaliacao-content">
        <h1 className="autoavaliacao-title">Avaliação de Subordinados</h1>

        <div className="supervisor-selection">
          <select
            className="supervisor-select"
            onChange={(e) => handleSupervisorSelect(e.target.value)}
            value={selectedSupervisor?.login || ""}
          >
            <option className="text-xs" value="">
              Selecione um funcionario
            </option>
            {supervisorOptions.map((supervisor) => (
              <option
                key={supervisor.login}
                value={supervisor.login}
                disabled={supervisor.avaliado}
                className={supervisor.avaliado ? "avaliado" : "pendente"}
              >
                {supervisor.nome}{" "}
                {supervisor.avaliado ? "(Avaliado)" : "(Pendente)"}
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="loading">Carregando...</div>}

        {selectedSupervisor && !selectedSupervisor.avaliado ? (
          <>
            <div className="selected-supervisor">
              <h2>Avaliando: {selectedSupervisor.nome}</h2>
              <span className="matricula">
                Matrícula: {selectedSupervisor.matricula}
              </span>
            </div>

            {perguntas.map((pergunta) => (
              <div key={pergunta.id} className="question-container">
                <h3>{pergunta.assunto}</h3>
                <p>{pergunta.pergunta}</p>
                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className={`rating-button ${pergunta.resposta === rating ? "selected" : ""}`}
                      onClick={() => handleRatingChange(pergunta.id, rating)}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="comentario-container">
              <p>Pontos a destacar</p>
              <input
                className="comentario-input"
                type="text"
                placeholder="Pontos positivos"
                value={positivos}
                onChange={(e) => setPositivos(e.target.value)}
              />
              <p>Pontos a melhorar</p>
              <input
                className="comentario-input"
                type="text"
                placeholder="Melhorias"
                value={negativos}
                onChange={(e) => setNegativos(e.target.value)}
              />
              <p>Comentário (Opcional)</p>
              <textarea
                className="comentario-input"
                placeholder="Comentário (Opcional)"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2>Selecione um funcionario pendente para iniciar a avaliação</h2>
          </div>
        )}
      </div>
      {selectedSupervisor && !selectedSupervisor.avaliado && (
        <div className="autoavaliacao-left-sidebar">
          <div>
            <span>
              <h1>Avaliação de Lider</h1>
              <div
                style={{
                  position: "relative",
                  width: "150px",
                  height: "150px",
                  margin: "0 auto",
                }}
              >
                <svg
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: "rotate(-90deg)",
                  }}
                >
                  <circle
                    cx="75"
                    cy="75"
                    r="70"
                    stroke="#eee"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="75"
                    cy="75"
                    r="70"
                    stroke={
                      perguntas.filter((q) => q.resposta).length ===
                        perguntas.length
                        ? "#4CAF50"
                        : "#ddd"
                    }
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - perguntas.filter((q) => q.resposta).length / perguntas.length)}`}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <h2 id="respostas-count">
                    {Math.round(
                      (perguntas.filter((q) => q.resposta).length /
                        perguntas.length) *
                      100,
                    )}
                    %
                  </h2>
                </div>
              </div>
            </span>
          </div>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={perguntas.some((q) => !q.resposta)}
          >
            Enviar Avaliação
          </button>
        </div>
      )}
    </div>
  );
};

export default Lideres;
