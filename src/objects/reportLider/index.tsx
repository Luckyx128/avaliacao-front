import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './style.css';
import { useCookies } from 'react-cookie';
interface Comentario {
  comentario: string;
  data: string;
  negativos: string;
  positivos: string;
}

interface Lider {
  comentarios: Comentario[];
  matricula: number;
  media: number;
  nome: string;
  por_assunto: {
    [key: string]: {
      media: number;
    };
  };
  total_avaliadores: number;
}

interface LeadershipData {
  lideres: {
    [key: string]: Lider;
  };
  media_geral: number;
  total_avaliacoes: number;
}

const LeadershipReport: React.FC = () => {
  const [data, setData] = useState<LeadershipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterdata, setFilterdata] = useState<LeadershipData | null>(null);
  const [cookies] = useCookies(['login']);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api}relatorios/lideranca?login=${cookies.login}`);
        const result = await response.json();
        setData(result.data);
        setFilterdata(result.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilter = (filter: string) => {
    if (!data) return;
    const filteredData: LeadershipData = {
      lideres: { [filter]: data.lideres[filter] },
      media_geral: data.media_geral,
      total_avaliacoes: data.total_avaliacoes
    };
    if (filter === "") {
      setFilterdata(data);
    } else {
      setFilterdata(filteredData);
    }
  };  

  if (loading) return <div className="loading">Carregando...</div>;
  if (!data) return <div className="error">Erro ao carregar dados</div>;

  return (
    <div className="leadership-report">
      <div className="report-header">
        <div className="overview">
          <h1>Avaliação de Liderança</h1>
          <div className="stats">
            <div className="stat-item">
              <span className="label">Média Geral</span>
              <span className="value">{data.media_geral.toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="label">Total de Avaliações</span>
              <span className="value">{data.total_avaliacoes}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="filter-section">
        <select onChange={(e) => handleFilter(e.target.value)}>
          <option value="">Todos</option>
          {Object.entries(data.lideres).sort((a, b) => a[1].nome.localeCompare(b[1].nome)).map(([id, lider]) => (
            <option key={id} value={id}>{lider.nome}</option>
          ))}
        </select>
      </div>

      <div className="leaders-grid">
        {Object.entries(filterdata?.lideres || {}).map(([id, lider]) => (
          <div key={id} className="leader-card">
            <div className="leader-header">
              <div className="leader-info">
                <h2>{lider.nome}</h2>
                <span className="matricula">Mat: {lider.matricula}</span>
              </div>
              <div className="leader-score">
                <span className={`score score-${Math.floor(lider.media)}`}>
                  {lider.media.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="metrics-section">
              <h3>Avaliação por Competência</h3>
              <div className="metrics-grid">
                {Object.entries(lider.por_assunto).map(([assunto, { media }]) => (
                  <div key={assunto} className="metric-item">
                    <span className="metric-label">{assunto}</span>
                    <span className={`metric-value score-${Math.floor(media)}`}>
                      {media.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {lider.comentarios.length > 0 && (
              <div className="feedback-section">
                <h3>Feedbacks Recentes</h3>
                <div className="feedback-list">
                  {lider.comentarios.map((comentario, index) => (
                    <div key={index} className="feedback-card">
                      <div className="feedback-header">
                        <span className="data">{comentario.data}</span>
                      </div>
                      <div className="feedback-content">
                        {comentario.positivos && (
                          <div className="feedback-item positivo">
                            <h4>Pontos Positivos</h4>
                            <p>{comentario.positivos}</p>
                          </div>
                        )}
                        {comentario.negativos && (
                          <div className="feedback-item negativo">
                            <h4>Pontos a Melhorar</h4>
                            <p>{comentario.negativos}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadershipReport;
