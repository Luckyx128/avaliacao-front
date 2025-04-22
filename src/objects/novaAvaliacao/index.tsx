import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "./style.css";
import api from "../../services/api";
interface NovaAvaliacaoProps {
  fetchOptions: (nome: string, setData: (value: Data[]) => void) => void;
  perguntas: Data[];
  setPerguntas: (value: Data[]) => void;
  assuntos: Data[];
  setAssuntos: (value: Data[]) => void;
  tipos: Data[];
  setTipos: (value: Data[]) => void;
  setores: Data[];
  setSetores: (value: Data[]) => void;
}
type FormData = {
  pergunta: string;
  assunto: string;
  tipo: string;
  setor: string;
};

type Data = {
  id: number;
  nome: string;
};
const NovaAvaliacao = ({
  fetchOptions,
  perguntas,
  setPerguntas,
  assuntos,
  setAssuntos,
  tipos,
  setTipos,
  setores,
  setSetores,
}: NovaAvaliacaoProps) => {
 

  useEffect(() => {
    fetchOptions("perguntas", setPerguntas);
    fetchOptions("assuntos", setAssuntos);
    fetchOptions("tipos", setTipos);
    fetchOptions("setores", setSetores);
  }, []);

  const handlerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData) as Record<string, string>;
      const data: FormData = {
        pergunta: formValues.pergunta,
        assunto: formValues.assunto,
        setor: formValues.setor,
        tipo: formValues.tipo,
      };

      const response = await fetch(`${api}create/avaliacao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      switch (result.status_code) {
        case 200:
          Swal.fire({
            title: "Sucesso!",
            text: "Nova avaliação cadastrada!",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          break;
        case 500:
          Swal.fire({
            title: "Erro!",
            text: "Erro ao cadastrar nova avaliação!",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao cadastrar nova avaliação!",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };
  return (
    <section className="card-section">
      <h2>Cadastro de avaliação</h2>
      <form className="formsection" onSubmit={handlerSubmit}>
        <select name="pergunta" className="select-options">
          <option value="">Selecione uma pergunta</option>
          {perguntas.map((pergunta) => (
            <option key={pergunta.id} value={pergunta.id}>
              {pergunta.nome}
            </option>
          ))}
        </select>

        <select name="assunto" className="select-options">
          <option value="">Selecione um assunto</option>
          {assuntos.map((assunto) => (
            <option key={assunto.id} value={assunto.id}>
              {assunto.nome}
            </option>
          ))}
        </select>

        <select name="setor" className="select-options">
          <option value="">Selecione um setor</option>
          {setores.map((setor) => (
            <option key={setor.id} value={setor.id}>
              {setor.nome}
            </option>
          ))}
        </select>

        <select name="tipo" className="select-options">
          <option value="">Selecione um tipo</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </option>
          ))}
        </select>
        <button /* TODO diabled sistem  */ className="btn-primary">
          Cadastra nova avaliação
        </button>
      </form>
    </section>
  );
};

export default NovaAvaliacao;
