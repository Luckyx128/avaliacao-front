import { useState } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import { IoChevronDown } from "react-icons/io5";

interface SidebarProps {
  onMenuSelect: (menu: string, matricula?: string) => void;
  mes: string;
  statusTipo2: string;
  statusTipo1: string;
  statusTipo3: string;
  matricula: string;
}

const Sidebar = ({
  onMenuSelect,
  mes,
  statusTipo2,
  statusTipo1,
  statusTipo3,
  matricula,
}: SidebarProps) => {
  const [selectedMenu, setSelectedMenu] = useState("autoavaliacao");
  const [cookie] = useCookies(["cargo"]);
  const [avaliacoesOpen, setAvaliacoesOpen] = useState(true);
  const [relatoriosOpen, setRelatoriosOpen] = useState(true);
  const [administracaoOpen, setAdministracaoOpen] = useState(true);
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
        <div className="menu-section">
          <button
            className={`section-header ${avaliacoesOpen ? "open" : ""}`}
            onClick={() => setAvaliacoesOpen(!avaliacoesOpen)}
          >
            <h1>Avaliações</h1>
            <IoChevronDown />
          </button>

          <div className={`section-content ${avaliacoesOpen ? "open" : ""}`}>
            <div className="menu-items-container">
              {statusTipo2 === "Avaliação não disponível" ? null : (
                <button
                  disabled={statusTipo2 === "Avaliação já respondida"}
                  className={`menu-item ${selectedMenu === "autoavaliacao" ? "active" : ""}`}
                  onClick={() => handleMenuClick("autoavaliacao")}
                >
                  <span>Autoavaliação</span>
                  <span className="status-indicator">
                    {statusTipo2 === "Avaliação já respondida"
                      ? "Respondida"
                      : "Pendente"}
                  </span>
                </button>
              )}

              {statusTipo1 === "Avaliação não disponível" ? null : (
                <button
                  disabled={statusTipo1 === "Avaliação já respondida"}
                  className={`menu-item ${selectedMenu === "avaliacao-lideranca" ? "active" : ""}`}
                  onClick={() => handleMenuClick("avaliacao-lideranca")}
                >
                  <span>Avaliação de Liderança</span>
                  <span className="status-indicator">
                    {statusTipo1 === "Avaliação já respondida"
                      ? "Respondida"
                      : "Pendente"}
                  </span>
                </button>
              )}
              {statusTipo3 === "Avaliação não disponível" ? null : (
                <button
                  disabled={statusTipo3 === "Avaliação já respondida"}
                  className={`menu-item ${selectedMenu === "avaliacao-lideres" ? "active" : ""}`}
                  onClick={() => handleMenuClick("avaliacao-lideres")}
                >
                  <span>Avaliação de Subordinados</span>
                  <span className="status-indicator">
                    {statusTipo3 === "Avaliação já respondida"
                      ? "Respondida"
                      : "Pendente"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="menu-section">
          <button
            className={`section-header ${relatoriosOpen ? "open" : ""}`}
            onClick={() => setRelatoriosOpen(!relatoriosOpen)}
          >
            <h1>Relatórios</h1>
            <IoChevronDown />
          </button>

          <div className={`section-content ${relatoriosOpen ? "open" : ""}`}>
            <div className="menu-items-container">
              <button
                className={`menu-item ${selectedMenu === "relatorio-individual" ? "active" : ""}`}
                onClick={() =>
                  handleMenuClick("relatorio-individual", matricula)
                }
              >
                {cookie.cargo === 1 ||
                  cookie.cargo === 6 ||
                  cookie.cargo === 4 ||
                  cookie.cargo === 7 ? (
                  <span>Avaliação Individual</span>
                ) : (
                  <span>Minha Avaliação</span>
                )}
              </button>

              {(cookie.cargo === 1 ||
                cookie.cargo === 6 ||
                cookie.cargo === 4 ||
                cookie.cargo === 7) && (
                  <>
                    <button
                      className={`menu-item ${selectedMenu === "relatorio-geral" ? "active" : ""}`}
                      onClick={() => handleMenuClick("relatorio-geral")}
                    >
                      <span>Visão Geral</span>
                    </button>
                  </>
                )}
              {(cookie.cargo === 6 ||
                cookie.cargo === 5 ||
                cookie.cargo === 9 ||
                cookie.cargo === 10 ||
                cookie.cargo === 11) && (
                  <button
                    className={`menu-item ${selectedMenu === "relatorio-equipe" ? "active" : ""}`}
                    onClick={() => handleMenuClick("relatorio-equipe")}
                  >
                    <span>Avaliação de Equipe</span>
                  </button>
                )}
              {cookie.cargo === 6 && (
                <button
                  className={`menu-item ${selectedMenu === "relatorio-lideranca" ? "active" : ""}`}
                  onClick={() => handleMenuClick("relatorio-lideranca")}
                >
                  <span>Avaliação de Liderança</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="menu-section">
          <button
            className={`section-header ${administracaoOpen ? "open" : ""}`}
            onClick={() => setAdministracaoOpen(!administracaoOpen)}
          >
            <h1>Administração</h1>
            <IoChevronDown />
          </button>
          {cookie.cargo === 1 ? (
            <div
              className={`section-content ${administracaoOpen ? "open" : ""}`}
            >
              <div className="menu-items-container">
                <button
                  className={`menu-item ${selectedMenu === "gerenciamento" ? "active" : ""}`}
                  onClick={() => handleMenuClick("gerenciamento")}
                >
                  <span>Gerencimento</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
