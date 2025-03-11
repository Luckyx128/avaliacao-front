import { useState } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';

interface SidebarProps {
  onMenuSelect: (menu: string, matricula?: string) => void;
  mes: string;
  statusTipo2: string;
  statusTipo1: string;
  matricula: string;
}

const Sidebar = ({ onMenuSelect, mes, statusTipo2, statusTipo1, matricula }: SidebarProps) => {
  const [selectedMenu, setSelectedMenu] = useState('autoavaliacao');
  const [cookie] = useCookies(['cargo']);
  
  const handleMenuClick = (menu: string, matricula?: string) => {
    setSelectedMenu(menu);
    onMenuSelect(menu, matricula);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Sistema de Avaliação</h2>
      <div className="month-section">
        <h2>{mes.charAt(0).toUpperCase() + mes.slice(1)}</h2>
      </div>
      
      <nav className="sidebar-menu">
        <h1>Avaliações</h1>
        {statusTipo2 === 'Avaliação não disponível' ? null : (
          <button
            disabled={statusTipo2 === 'Avaliação já respondida'}
            className={`menu-item ${selectedMenu === 'autoavaliacao' ? 'active' : ''}`}
            onClick={() => handleMenuClick('autoavaliacao')}
          >
            <span>Autoavaliação</span>
            <span className="status-indicator">
              {statusTipo2 === 'Avaliação já respondida' ? 'Respondida' : 'Pendente'}
            </span>
          </button>
        )}
       
        {statusTipo1 === 'Avaliação não disponível' ? null : (
          <button
            disabled={statusTipo1 === 'Avaliação já respondida'}
            className={`menu-item ${selectedMenu === 'avaliacao-lideranca' ? 'active' : ''}`}
            onClick={() => handleMenuClick('avaliacao-lideranca')}
          >
            <span>Avaliação de Liderança</span>
            <span className="status-indicator">
              {statusTipo1 === 'Avaliação já respondida' ? 'Respondida' : 'Pendente'}
            </span>
          </button>
        )}
  <h1>Relatórios</h1>
            <button
              className={`menu-item ${selectedMenu === 'relatorio-individual' ? 'active' : ''}`}
              onClick={() => handleMenuClick('relatorio-individual', matricula)}
            >{cookie.cargo === 1 || cookie.cargo === 6 || cookie.cargo === 4 || cookie.cargo === 7 ? (
              <span>Avaliação Individual</span>
            ) : (
              <span>Minha Avaliação</span>
            )}
            </button>
        {(cookie.cargo === 1 || cookie.cargo === 6 || cookie.cargo === 4 || cookie.cargo === 7) && (
          <>
          
            <button
              className={`menu-item ${selectedMenu === 'relatorio-geral' ? 'active' : ''}`}
              onClick={() => handleMenuClick('relatorio-geral')}
            >
              <span>Visão Geral</span>
            </button>
            <button
              className={`menu-item ${selectedMenu === 'relatorio-equipe' ? 'active' : ''}`}
              onClick={() => handleMenuClick('relatorio-equipe')}
            >
              <span>Avaliação de Equipe</span>
            </button>
            <button
              className={`menu-item ${selectedMenu === 'relatorio-lideranca' ? 'active' : ''}`}
              onClick={() => handleMenuClick('relatorio-lideranca')}
            >
              <span>Avaliação de Liderança</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
