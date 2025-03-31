import React, { useEffect, useState } from 'react';
import './styles.css';
import api from '../../services/api';

interface ReportData {
  media_geral: number;
  por_assunto: {
    [key: string]: {
      media: number;
    };
  };
  por_gestor: {
    [key: string]: {
      media: number;
    };
  };
  por_setor: {
    [key: string]: {
      media: number;
    };
  };
  por_supervisor: {
    [key: string]: {
      media: number;
    };
  };
  total_avaliacoes: number;
}

interface ReportResponse {
  data: ReportData;
  message: string;
  status_code: number;
}

const ReportCard: React.FC<{
  title: string;
  value: number;
  category: 'gestor' | 'supervisor' | 'colaborador';
  trend?: number;
}> = ({ title, value, category, trend }) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'gestor':
        return 'var(--primary)';
      case 'supervisor':
        return 'var(--secondary)';
      case 'colaborador':
        return 'var(--rgb-accent)';
      default:
        return 'var(--text-light)';
    }
  };

  return (
    <div className="report-card">
      <div className="report-header">
        <h3>{title}</h3>
        <div className="category-badge" style={{ backgroundColor: getCategoryColor() }}>
          {category}
        </div>
      </div>
      <div className="report-value">
        <span className="value">{value.toFixed(1)}</span>
        <span className="unit">/ 5.0</span>
      </div>
      {trend !== undefined && (
        <div className="trend-indicator">
          <span className={`trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
  );
};

const SubjectCard: React.FC<{
  subject: string;
  media: number;
}> = ({ subject, media }) => {
  const getColorByValue = (value: number) => {
    if (value >= 4.5) return 'var(--success)';
    if (value >= 4.0) return 'var(--primary)';
    if (value >= 3.0) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="subject-card">
      <h3>{subject}</h3>
      <div className="subject-value" style={{ color: getColorByValue(media) }}>
        {media.toFixed(1)}
      </div>
    </div>
  );
};

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(`${api}relatorios/geral`);
        const data: ReportResponse = await response.json();
        setReportData(data.data);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <div className="loading">Carregando relatório...</div>;
  }

  if (!reportData) {
    return <div className="error">Erro ao carregar relatório</div>;
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Relatório Geral de Avaliações</h1>
        <div className="reports-filters">
          <select className="period-select">
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
          </select>
        </div>
      </div>

      <div className="overview-section">
        <div className="overview-card">
          <h2>Média Geral</h2>
          <div className="overview-value">{reportData.media_geral.toFixed(1)}</div>
          <div className="overview-subtitle">Total de Avaliações: {reportData.total_avaliacoes}</div>
        </div>
      </div>

      <div className="reports-grid">
        <ReportCard 
          title="Média por Gestor" 
          value={Object.values(reportData.por_gestor)[0]?.media || 0} 
          category="gestor"
        />
        <ReportCard 
          title="Média por Supervisor" 
          value={Object.values(reportData.por_supervisor)[0]?.media || 0} 
          category="supervisor"
        />
        <ReportCard 
          title="Média por Setor" 
          value={Object.values(reportData.por_setor)[0]?.media || 0} 
          category="colaborador"
        />
      </div>

      <div className="subjects-section">
        <h2>Médias por Assunto</h2>
        <div className="subjects-grid">
          {Object.entries(reportData.por_assunto).map(([subject, data]) => (
            <SubjectCard 
              key={subject}
              subject={subject}
              media={data.media}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports; 