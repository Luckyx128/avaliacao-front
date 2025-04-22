import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import './style.css';
import ColaboradorSearch from '../colaboradorSearch';
import html2pdf from 'html2pdf.js';


interface tipoP{
  [key: string]: { media: number };
}
interface tipo23{
  assunto: string;
  data: string;
  nota: number;
}

interface Historico {
  tipo_1: tipoP;
  tipo_2: tipo23[];
  tipo_3: tipo23[];
}

interface Colaborador {
  funcao: string;
  historico: Historico;
  media: number;
  nome: string;
  setor_nome: string;
  total_avaliacoes: number;
}

interface Feedback {
  comentario: string;
  data: string;
  matricula: number;
  negativos: string;
  positivos: string;
  nome: string;
}

interface EquipeData {
  feedback_geral: {
    comentarios: Feedback[];
  };
  gestor: string;
  gestor_nome: string;
  media_geral_equipe: number;
  por_assunto: {
    [key: string]: { media: number };
  };
  por_colaborador: {
    [key: string]: Colaborador;
  };
  por_mes: {
    [key: string]: { media: number };
  };
  total_colaboradores: number;
}

interface TeamReportProps {
  login: string;
}

const TeamReport: React.FC<TeamReportProps> = ({ login }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<EquipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (targetLogin: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${api}relatorios/equipe/${targetLogin}`);
      const result = await response.json();
      
      if (result.status_code === 404) {
        setError('Nenhuma equipe encontrada');
        setData(null);
      } else {
        setData(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados da equipe');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = () => {
    if (reportRef.current) {
      const element = reportRef.current;
      const opt = {
        margin: 1,
        filename: `relatorio_equipe_${data?.gestor_nome || 'equipe'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a2', orientation: 'landscape' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };

  useEffect(() => {
    fetchData(login);
  }, [login]);

  return (
    <div className="team-report" ref={reportRef}>
      <div className="report-actions">
        <button onClick={handleGeneratePDF} className="btn-pdf">
          Gerar PDF
        </button>
      </div>
      
      <ColaboradorSearch 
        onSelectNome={(novoLogin) => {
          setData(null);
          fetchData(novoLogin);
        }}
        onSelect={(novoLogin) => {
          setData(null);
          fetchData(novoLogin);
        }}
        currentMatricula={login}
        searchType="lideranca"
        apiEndpoint="colaboradores/busca-lideranca"
        placeholder="Buscar gestor ou supervisor..."
      />
      
      {loading && <div className="loading">Carregando...</div>}
      
      {error && (
        <div className="empty-state">
          <div className="empty-state-content">
            <h2>{error}</h2>
            <p>Utilize a busca acima para encontrar um gestor ou supervisor</p>
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="report-header">
            <div className="equipe-info">
              <h1>Equipe {data.gestor_nome}</h1>
              <span className="stats">
                {data.total_colaboradores} colaboradores | {Object.values(data.por_colaborador).filter(c => c.total_avaliacoes > 0).length} avaliados
              </span>
            </div>
            <div className="header-actions">
              <div className="media-geral">
                <span className="label">Média da Equipe</span>
                <span className="value">{data.media_geral_equipe.toFixed(1)}</span>
              </div>
              <button onClick={handleGeneratePDF} className="btn-pdf">
                Exportar PDF
              </button>
            </div>
          </div>

          <div className="report-content">
            <div className="metricas-section">
              <h2>Métricas por Assunto</h2>
              <div className="assuntos-grid">
                {Object.entries(data.por_assunto).map(([assunto, { media }]) => (
                  <div key={assunto} className="assunto-card">
                    <h3>{assunto}</h3>
                    <div className={`nota nota-${Math.floor(media)}`}>
                      {media.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="colaboradores-section">
              <h2>Colaboradores</h2>
              <div className="colaboradores-grid">
                {Object.entries(data.por_colaborador).map(([matricula, colaborador]) => (
                  <div key={matricula} className={`colaborador-card ${colaborador.total_avaliacoes === 0 ? 'pendente' : ''}`}>
                    <div className="colaborador-header">
                      <div className="colaborador-info">
                        <h3>{colaborador.nome}</h3>
                        <span className="setor">{colaborador.setor_nome}</span>
                      </div>
                      <div className="status">
                        {colaborador.total_avaliacoes > 0 ? (
                          <span className="media">{colaborador.media.toFixed(1)}</span>
                        ) : (
                          <span className="pendente">Pendente</span>
                        )}
                      </div>
                    </div>
                    {colaborador.total_avaliacoes > 0 && (
                      <div className="avaliacoes-container">
                        <div className="avaliacao-section">
                          <div className="historico-header">
                            <span>Assunto</span>
                            <span>Operador</span>
                            <span>Auto</span>
                            <span>Coordenador</span>
                          </div>
                          <div className="historico-preview">
                            {Object.keys({...colaborador.historico.tipo_1, 
                              ...Object.fromEntries(colaborador.historico.tipo_2.map(h => [h.assunto, h])),
                              ...Object.fromEntries(colaborador.historico.tipo_3.map(h => [h.assunto, h]))
                            }).map(assunto => (
                              <div key={assunto} className="historico-item">
                                <span className="assunto">{assunto}</span>
                                <div className="notas-container">
                                  <span className={`nota nota-${Math.floor(colaborador.historico.tipo_1[assunto]?.media || 0)}`}>
                                    {colaborador.historico.tipo_1[assunto]?.media?.toFixed(1) || '-'}
                                  </span>
                                  <span className={`nota nota-${Math.floor(colaborador.historico.tipo_2.find(h => h.assunto === assunto)?.nota || 0)}`}>
                                    {colaborador.historico.tipo_2.find(h => h.assunto === assunto)?.nota?.toFixed(1) || '-'}
                                  </span>
                                  <span className={`nota nota-${Math.floor(colaborador.historico.tipo_3.find(h => h.assunto === assunto)?.nota || 0)}`}>
                                    {colaborador.historico.tipo_3.find(h => h.assunto === assunto)?.nota?.toFixed(1) || '-'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="feedback-section">
              <h2>Feedbacks Recentes</h2>
              <div className="feedback-grid">
                {data.feedback_geral.comentarios.map((feedback, index) => (
                  <div key={index} className="feedback-card">
                    <div className="feedback-header">
                      <span className="nome">{feedback.nome}</span>
                      <span className="data">{feedback.data}</span>
                    </div>
                    {(feedback.positivos || feedback.negativos) && (
                      <div className="feedback-content">
                        {feedback.positivos && (
                          <div className="feedback-item positivo">
                            <h4>Pontos Positivos</h4>
                            <p>{feedback.positivos}</p>
                          </div>
                        )}
                        {feedback.negativos && (
                          <div className="feedback-item negativo">
                            <h4>Pontos a Melhorar</h4>
                            <p>{feedback.negativos}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamReport;
