import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import NovaAvaliacao from "../../objects/novaAvaliacao";
import "./style.css";
import NovosParametros from "../../objects/novoParametro";
import api from "../../services/api";
import ManipularUsuario from "../../objects/manipularUsuario";
type responseData = {
  message: string;
  status_code: number;
  data: Data[];
};
type Data = {
  id: number;
  nome: string;
};

const Gerenciamento = () => {
  const [cookies] = useCookies(["cargo"]);
  const [perguntas, setPerguntas] = useState<Data[]>([
    { id: 0, nome: "Nenhuma pergunta carregada" },
  ]);
  const [assuntos, setAssuntos] = useState<Data[]>([
    { id: 0, nome: "Nenhum assunto carregado" },
  ]);
  const [tipos, setTipos] = useState<Data[]>([
    { id: 0, nome: "Nenhum tipo carregado" },
  ]);
  const [setores, setSetores] = useState<Data[]>([
    { id: 0, nome: "Nenhum setor carregado" },
  ]);
  useEffect(() => {
    if (cookies.cargo !== 1) {
      window.location.href = "/playground4/dashboard";
    }
  }, [cookies.cargo]);

  const fetchOptions = async (
    nome: string,
    setData: (value: Data[]) => void
  ) => {
    const response = await fetch(`${api}list/${nome}`);
    const data: responseData = await response.json();
    setData(data.data);
  };
  return (
    <section id="section-gerenciamento">
      <h1>Gerenciamento</h1>
      <NovaAvaliacao
        fetchOptions={fetchOptions}
        perguntas={perguntas}
        tipos={tipos}
        assuntos={assuntos}
        setores={setores}
        setPerguntas={setPerguntas}
        setAssuntos={setAssuntos}
        setTipos={setTipos}
        setSetores={setSetores}
      />
      <section id="split-section">
        <NovosParametros
          fetchOptions={fetchOptions}
          setPerguntas={setPerguntas}
          setAssuntos={setAssuntos}
          setTipos={setTipos}
          setSetores={setSetores}
        />
        <ManipularUsuario 
          setores={setores}/>
      </section>
    </section>
  );
};

export default Gerenciamento;
