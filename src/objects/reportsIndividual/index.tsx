import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './style.css';
import ColaboradorSearch from '../colaboradorSearch';
import { useCookies } from 'react-cookie';
interface Avaliacao {
  assunto: string;
  avaliador: string;
  data: string;
  nota: number;
}

interface Feedback {
  comentarios: {
    comentario: string;
    data: string;
    negativos: string;
    positivos: string;
  }[];
  pontos_negativos: string;
  pontos_positivos: string;
}

interface IndividualReportData {
  avaliacoes: {
    historico: Avaliacao[];
    media_geral: number;
    por_assunto: {
      [key: string]: { media: number };
    };
    por_mes: {
      [key: string]: { media: number };
    };
    total: number;
  };
  colaborador: {
    funcao: string;
    gestor: string;
    matricula: number;
    nome: string;
  };
  feedback: Feedback;
}

interface IndividualReportProps {
  matricula: string;
}

const IndividualReport: React.FC<IndividualReportProps> = ({ matricula }) => {
  const [data, setData] = useState<IndividualReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['cargo']);
  const fetchData = async (targetMatricula: string) => {
    try {
      const response = await fetch(`${api}relatorios/individual/${targetMatricula}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(matricula);
  }, [matricula]);

  if (loading) return <div className="loading">Carregando...</div>;
  if (!data) return <div className="error">Erro ao carregar dados</div>;

  return (
    <div className="individual-report">
      {cookies.cargo !== 2 && cookies.cargo !== 3 && cookies.cargo !== 5 && cookies.cargo !== 8 && (
        <ColaboradorSearch 
        onSelectNome={(novaMatricula) => {
          setData(null);
          setLoading(true);
          fetchData(novaMatricula);
        }}
          onSelect={(novaMatricula) => {
          setData(null);
          setLoading(true);
          fetchData(novaMatricula);
        }}
        currentMatricula={matricula}
      />
      )}
      <div className="report-header">
        <div className="colaborador-info">
          <h1>{data.colaborador.nome}</h1>
          <span className="matricula">Matrícula: {data.colaborador.matricula}</span>
        </div>
        <div className="media-geral">
          <span className="label">Média Geral</span>
          <span className="value">{data.avaliacoes.media_geral.toFixed(1)}</span>
          <span className="total">Total de avaliações: {data.avaliacoes.total}</span>
        </div>
      </div>

      <div className="report-content">
        <div className="avaliacoes-section">
          <h2>Avaliações por Assunto</h2>
          <div className="assuntos-grid">
            {Object.entries(data.avaliacoes.por_assunto).map(([assunto, { media }]) => (
              <div key={assunto} className="assunto-card">
                <h3>{assunto}</h3>
                <div className={`nota nota-${Math.floor(media)}`}>
                  {media.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="feedback-section">
          <h2>Feedback</h2>
          {data.feedback.comentarios.map((feedback, index) => (
            <div key={index} className="feedback-card">
              <div className="feedback-header">
                <span className="data">{feedback.data}</span>
              </div>
              <div className="feedback-content">
                <div className="feedback-item positivo">
                  <h4>Pontos Positivos</h4>
                  <p>{feedback.positivos}</p>
                </div>
                <div className="feedback-item negativo">
                  <h4>Pontos a Melhorar</h4>
                  <p>{feedback.negativos}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="historico-section">
          <h2>Histórico de Avaliações</h2>
          <div className="historico-grid">
            {data.avaliacoes.historico.map((avaliacao, index) => (
              <div key={index} className="historico-card">
                <div className="historico-header">
                  <span className="data">{avaliacao.data}</span>
                  <span className={`nota nota-${Math.floor(avaliacao.nota)}`}>
                    {avaliacao.nota.toFixed(1)}
                  </span>
                </div>
                <h3>{avaliacao.assunto}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualReport; 