import { useState } from 'react';
import './style.css';

interface SidebarProps {
  onMenuSelect: (menu: string) => void;
  mes: string;
  statusTipo2: string;
  statusTipo1: string;
}

const Sidebar = ({ onMenuSelect,mes, statusTipo2, statusTipo1 }: SidebarProps) => {
  const [selectedMenu, setSelectedMenu] = useState('autoavaliacao');
  
  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    onMenuSelect(menu);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Sistema de Avaliação</h2>
      <h2>{mes.charAt(0).toUpperCase() + mes.slice(1)} </h2>
      <nav className="sidebar-menu">
        <button
          disabled={statusTipo2 === 'Avaliação já respondida'}
          className={`menu-item ${selectedMenu === 'autoavaliacao' ? 'active' : ''}`}
          onClick={() => handleMenuClick('autoavaliacao')}
        >
          Autoavaliação
        </button>

        <button
          disabled={statusTipo1 === 'Avaliação já respondida'}
          className={`menu-item ${selectedMenu === 'avaliacao-lideranca' ? 'active' : ''}`}
          onClick={() => handleMenuClick('avaliacao-lideranca')}
        >
          Avaliação de Liderança
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
