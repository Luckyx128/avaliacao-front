import Assunto from "./Assunto";
import Tipo from "./Tipo";
import Pergunta from "./Pergunta";
import Setor from "./Setor";
import React, { useState } from "react";
import "./style.css";
import Swal from "sweetalert2";
import api from "../../services/api";
type FormData = {
  name: string;
};
type Data = {
   id: number;
   nome: string;
 }
interface NovosParametrosProps {
   fetchOptions: (nome: string, setData: (value: Data[]) => void) => void;
   setPerguntas: (value: Data[]) => void;
   setAssuntos: (value: Data[]) => void;
   setTipos: (value: Data[]) => void;  
   setSetores: (value: Data[]) => void;
 }
const NovosParametros = (props: NovosParametrosProps) => {
  const [aba, setAba] = useState<string>("pergunta");

  const handlerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData) as Record<string, string>;
      let novoParametro = "";
      let setData = props.setAssuntos
      switch (formValues.destino) {
        case "tipo":
          novoParametro = formValues.tipo;
          setData = props.setTipos
          break;
        case "assunto":
          novoParametro = formValues.assunto;
          setData = props.setAssuntos
          break;
        case "setor":
          novoParametro = formValues.setor;
          setData = props.setSetores
          break;
        case "pergunta":
          novoParametro = formValues.pergunta;
          setData = props.setPerguntas
          break;
      }
      const data: FormData = {
        name: novoParametro,
      };
      console.log(data)
      const response = await fetch(`${api}creat/${formValues.destino}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json();
      switch (result.status_code) {
        case 200:
          Swal.fire({
            title: "Sucesso!",
            text: "Nova avaliação cadastrada!",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          props.fetchOptions(formValues.destino,setData)
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

  const renderBody = () => {
    switch (aba) {
      case "pergunta":
        return <Pergunta handlerSubmit={handlerSubmit} />;
      case "tipo":
        return <Tipo handlerSubmit={handlerSubmit} />;
      case "setor":
        return <Setor handlerSubmit={handlerSubmit} />;
      case "assunto":
        return <Assunto handlerSubmit={handlerSubmit} />;
    }
  };
  return (
    <section className="split-card-section">
      <h2>Cadastro de parametro de avaliação</h2>
      <section id="parametros-header">
        <button
          className={aba === "pergunta" ? "active" : ""}
          onClick={() => {
            setAba("pergunta");
          }}
        >
          Pergunta
        </button>
        <button
          className={aba === "tipo" ? "active" : ""}
          onClick={() => {
            setAba("tipo");
          }}
        >
          Tipo
        </button>
        <button
          className={aba === "setor" ? "active" : ""}
          onClick={() => {
            setAba("setor");
          }}
        >
          Setor
        </button>
        <button
          className={aba === "assunto" ? "active" : ""}
          onClick={() => {
            setAba("assunto");
          }}
        >
          Assunto
        </button>
      </section>
      <section id="parametros-body">{renderBody()}</section>
    </section>
  );
};

export default NovosParametros;
