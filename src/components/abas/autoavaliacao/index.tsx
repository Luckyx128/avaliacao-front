import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import "./style.css";
import api from "../../../services/api";

interface Pergunta {
  id: number;
  pergunta: string;
  assunto: string;
  resposta: number;
}
const Autoavaliacao = ({ setor }: { setor: string }) => {
  const [cookies] = useCookies(["matricula", "gestor", "super", "nome"]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [comentario, setComentario] = useState("");
  const [positivos, setPositivos] = useState("");
  const [negativos, setNegativos] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        const response = await fetch(`${api}questoes?tipo=2&setor=${setor}`);
        const data = await response.json();
        const perguntas: Pergunta[] = data.data.perguntas;
        setPerguntas(perguntas);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar questões:", error);
      }
    };

    fetchPerguntas();
  }, []);

  const handleRatingChange = (questionId: number, rating: number) => {
    console.log(questionId, rating);
    setPerguntas(
      perguntas.map((q) =>
        q.id === questionId ? { ...q, resposta: rating } : q,
      ),
    );
    console.log(perguntas);
  };

  const handleSubmit = async () => {
    try {
      const result = await Swal.fire({
        title: "Confirmar envio?",
        text: "Você não poderá alterar suas respostas depois",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, enviar!",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }
      const respostas = perguntas.map((q) => ({
        pergunta_id: q.id,
        resposta: q.resposta,
        matricula: cookies.matricula,
        comentario: comentario,
        positivos: positivos,
        negativos: negativos,
        gestor: cookies.gestor,
        super: cookies.super,
        nome: cookies.nome,
        tipo_id: 2,
      }));

      await fetch(`${api}respostas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ respostas }),
      });

      Swal.fire({
        title: "Sucesso!",
        text: "Autoavaliação enviada com sucesso!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: "Erro ao enviar autoavaliação",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };
  if (loading) {
    return <div className="loading">Carregando relatório...</div>;
  }
  return (
    <div className="autoavaliacao-container">
      <div className="autoavaliacao-content">
        <h1 className="autoavaliacao-title">Autoavaliação</h1>
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
      </div>
      <div className="autoavaliacao-left-sidebar">
        <div>
          <span>
            <h1>Autoavaliação</h1>

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
          Enviar Autoavaliação
        </button>
      </div>
    </div>
  );
};

export default Autoavaliacao;
