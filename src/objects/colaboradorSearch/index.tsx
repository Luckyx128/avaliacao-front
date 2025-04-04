import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './style.css';
import { useCookies } from 'react-cookie';
interface Colaborador {
  matricula: number;
  nome: string;
  funcao: string;
  setor_nome: string;
  setor_id: number;
  login: string;
}

interface ColaboradorSearchProps {
  onSelect: (identificador: string) => void;
  onSelectNome:(identificador: string) => void;
  currentMatricula: string;
  searchType?: 'colaborador' | 'lideranca' | 'supervisor' | 'gerenciamento';
  apiEndpoint?: string;
  placeholder?: string;
}

const ColaboradorSearch: React.FC<ColaboradorSearchProps> = ({ 
  onSelect, 
  onSelectNome,
  currentMatricula, 
  searchType = 'colaborador',
  apiEndpoint = 'colaboradores/busca',
  placeholder = "Buscar colaborador por nome ou matrícula..."
}) => {
  const [cookies] = useCookies(['login']);
  const [searchTerm, setSearchTerm] = useState('');
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchColaboradores = async () => {
      if (searchTerm.length < 3) {
        setColaboradores([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${api}${apiEndpoint}?termo=${searchTerm}&login=${cookies.login}&searchType=${searchType}`);
        const data = await response.json();
        setColaboradores(data.data || []);
      } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchColaboradores, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, apiEndpoint]);

  return (
    <div className="colaborador-search">
      <div className="search-container">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />
        {loading && <div className="search-loading">Buscando...</div>}
      </div>
      
      {showResults && searchTerm.length >= 3 && (
        <div className="search-results">
          {colaboradores.length > 0 ? (
            colaboradores.map((colaborador) => (
              <button
                key={colaborador.matricula}
                className={`colaborador-item ${colaborador.matricula.toString() === currentMatricula ? 'active' : ''}`}
                onClick={() => {
                  onSelect(searchType === 'colaborador' || searchType === 'gerenciamento' ? colaborador.matricula.toString() : colaborador.login);
                  searchType === 'gerenciamento'? onSelectNome(colaborador.nome) : null
                  setShowResults(false);
                  setSearchTerm('');
                }}
              >
                <div className="colaborador-info">
                  <span className="colaborador-nome">{colaborador.nome}</span>
                  <span className="colaborador-matricula">Mat: {colaborador.matricula}</span>
                </div>
                <span className="colaborador-funcao">{colaborador.setor_nome}</span>
              </button>
            ))
          ) : (
            <div className="no-results">Nenhum colaborador encontrado</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColaboradorSearch;
