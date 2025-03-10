import { useState } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';

interface SidebarProps {
  onMenuSelect: (menu: string) => void;
  mes: string;
  statusTipo2: string;
  statusTipo1: string;
}

const Sidebar = ({ onMenuSelect,mes, statusTipo2, statusTipo1 }: SidebarProps) => {
  const [selectedMenu, setSelectedMenu] = useState('autoavaliacao');
  const [cookie] = useCookies(['cargo']);
  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    onMenuSelect(menu);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Sistema de Avaliação</h2>
      <h2>{mes.charAt(0).toUpperCase() + mes.slice(1)} </h2>
      <nav className="sidebar-menu">
        <h1>Avaliações</h1>
        {statusTipo2 === 'Avaliação não disponível' ? null : (
          <button
            disabled={statusTipo2 === 'Avaliação já respondida'}
            className={`menu-item ${selectedMenu === 'autoavaliacao' ? 'active' : ''}`}
            onClick={() => handleMenuClick('autoavaliacao')}
        >
          Autoavaliação {statusTipo2 === 'Avaliação já respondida' ? '(Respondida)' : '(Não respondida)'}
        </button>
        )}
       
        {statusTipo1 === 'Avaliação não disponível' ? null : (
          <button
            disabled={statusTipo1 === 'Avaliação já respondida'}
            className={`menu-item ${selectedMenu === 'avaliacao-lideranca' ? 'active' : ''}`}
            onClick={() => handleMenuClick('avaliacao-lideranca')}
        >
          Avaliação de Liderança {statusTipo1 === 'Avaliação já respondida' ? '(Respondida)' : '(Não respondida)'}
        </button>
        )}
        {cookie.cargo === 1 || cookie.cargo === 6 ? (
          <>
          <h1>Relatórios</h1>
          {/* #TODO: Criar os relatórios */}
          <button className='menu-item'>
            Relatório de Avaliações
          </button>
          <button className='menu-item'>
            Relatório de Avaliações
          </button>
          <button className='menu-item'>
            Relatório de Avaliações
          </button>
          </>
        ) : null}
       
      </nav>
    </div>
  );
};

export default Sidebar;
