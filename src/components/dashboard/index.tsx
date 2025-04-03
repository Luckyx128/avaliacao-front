import { useEffect, useState } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import Header from "../../objects/header";
import Sidebar from "../../objects/sidebar";
import Autoavaliacao from "../abas/autoavaliacao";
import Lideranca from "../abas/lideranca";
import Reports from "../../objects/reports";
import IndividualReport from "../../objects/reportsIndividual";
import api from "../../services/api";
import TeamReport from "../../objects/reportEquipe";
import LeadershipReport from "../../objects/reportLider";
import Lideres from "../abas/lideres";
import Gerenciamento from "../Gerenciamento";
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
  const [statusTipo3, setStatusTipo3] = useState<string>('');
  const [selectedAba, setSelectedAba] = useState<string>('');
  const [selectedMatricula, setSelectedMatricula] = useState<string>('');

  if (!cookies.nome) {
    window.location.href = "/playground4/";
  }

  useEffect(() => {
    const date = new Date();
    setMes(date.toLocaleString('pt-BR', { month: 'long' }));
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
    const fetchStatusTipo3 = async () => {
      const response = await fetch(`${api}status_mes?matricula=${logado.matricula}&tipo=3&setor=${logado.cargo}`);
      const data: StatusMes = await response.json();
      setStatusTipo3(data.data.status);
    };
    fetchStatusTipo2();
    fetchStatusTipo1();
    fetchStatusTipo3();
  }, [logado.cargo,logado.matricula]);

  const handleMenuSelect = (menuItem: string, matricula?: string) => {
    setSelectedAba(menuItem);
    if (menuItem === 'relatorio-individual') {
      const targetMatricula = matricula || logado.matricula;
      setSelectedMatricula(targetMatricula);
    }
  };

  const renderContent = () => {
    switch (selectedAba) {
      case 'autoavaliacao':
        return <Autoavaliacao setor={logado.cargo} />;
      case 'avaliacao-lideranca':
        return <Lideranca />;
      case 'relatorio-geral':
        return <Reports />;
      case 'relatorio-individual':
        return <IndividualReport matricula={selectedMatricula || logado.matricula} />;
      case 'relatorio-equipe':
        return <TeamReport login={logado.login} />;
      case 'relatorio-lideranca':
        return <LeadershipReport />;
      case 'avaliacao-lideres':
        return <Lideres />;
      case 'gerenciamento':
        return <Gerenciamento/>
      default:
        return (
          <>
            <h2>Bem-vindo! {logado.nome}</h2>
            <h2>Selecione uma opção no menu</h2>
          </>
        );
    }
  };

  return (
    <>
      <Header nome={logado.nome}/>
      <main className="main-container">
        <Sidebar 
          onMenuSelect={handleMenuSelect} 
          mes={mes} 
          statusTipo2={statusTipo2} 
          statusTipo1={statusTipo1}
          statusTipo3={statusTipo3}
          matricula={logado.matricula}
        />
        <div className="content">
          {renderContent()}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
