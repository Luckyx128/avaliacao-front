import { useEffect, useState } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import Header from "../../objects/header";
import Sidebar from "../../objects/sidebar";
import Autoavaliacao from "../abas/autoavaliacao";
import Lideranca from "../abas/lideranca";
interface StatusMes {
  data: {
    status: string;
  },
  message: string;
  status_code: number;
}

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
 
  
  const [mes, setMes] = useState("");
  const [statusTipo2, setStatusTipo2] = useState<string>('');
  const [statusTipo1, setStatusTipo1] = useState<string>('');
  const [selectedAba, setSelectedAba] = useState<string>('');
  if (!cookies.nome) {
    window.location.href = "/";
  }

  const api = import.meta.env.VITE_HOST_API;
  

  useEffect(() => {
    const date = new Date();
    setMes(date.toLocaleString('default', { month: 'long' }));
    const fetchStatusTipo2 = async () => {
      const response = await fetch(`${api}status_mes?matricula=${logado.matricula}&tipo=2&setor=${logado.cargo}`);
      const data: StatusMes = await response.json();
      setStatusTipo2(data.data.status);
    };
    const fetchStatusTipo1 = async () => {  
      const response = await fetch(`${api}status_mes?matricula=${logado.matricula}&tipo=1&setor=${logado.cargo}`);
      const data: StatusMes = await response.json();
      setStatusTipo1(data.data.status);
    };
    fetchStatusTipo2();
    fetchStatusTipo1();
  }, []);

  const handleMenuSelect = (menuItem: string) => {
    setSelectedAba(menuItem);
  };

  return (
    <>
      <Header nome={logado.nome}/>
      <main className="main-container">
        <Sidebar  onMenuSelect={handleMenuSelect} mes={mes} statusTipo2={statusTipo2} statusTipo1={statusTipo1} />
        <div className="content">
          {selectedAba === 'autoavaliacao' ? (
            <Autoavaliacao   setor={logado.cargo} />
          ) : (
            selectedAba === 'avaliacao-lideranca' ? (
              <Lideranca   />
            ) : (
              <>
                <h2>Bem-vindo! {logado.nome}</h2>
                <h2>Nenhuma aba selecionada</h2>
              </>
            )
          )}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
