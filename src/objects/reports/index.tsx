import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import api from "../../services/api";
import TableComponent from "../table";
import BarChartComponent from "../grafico/Bar";
import html2pdf from 'html2pdf.js';
import { useWindowWidth } from "../../hooks/useWindowWidth";
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

type Assunto = {
	assunto: string;
	total: number;
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
};

type ResponseAssuntos = {
	data: {
		'Adaptação a Mudanças': Assunto,
		'Comunicação': Assunto,
		'Tomada de Decisão e Resolução': Assunto,
		'Trabalho em Equipe': Assunto,
		'Liderança': Assunto,
		'Adaptação a Mudanças%': Assunto,
		'Comunicação%': Assunto,
		'Tomada de Decisão e Resolução%': Assunto,
		'Trabalho em Equipe%': Assunto,
		'Liderança%': Assunto
	}

}


const ReportCard: React.FC<{
	title: string;
	value: number;
	category: "gestor" | "supervisor" | "colaborador";
	trend?: number;
}> = ({ title, value, category, trend }) => {
	const getCategoryColor = () => {
		switch (category) {
			case "gestor":
				return "var(--primary)";
			case "supervisor":
				return "var(--secondary)";
			case "colaborador":
				return "var(--rgb-accent)";
			default:
				return "var(--text-light)";
		}
	};

	return (
		<div className="report-card">
			<div className="report-header">
				<h3>{title}</h3>
				<div
					className="category-badge"
					style={{ backgroundColor: getCategoryColor() }}
				>
					{category}
				</div>
			</div>
			<div className="report-value">
				<span className="value">{value.toFixed(1)}</span>
				<span className="unit">/ 5.0</span>
			</div>
			{trend !== undefined && (
				<div className="trend-indicator">
					<span className={`trend ${trend >= 0 ? "positive" : "negative"}`}>
						{trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
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
		if (value >= 4.5) return "var(--success)";
		if (value >= 4.0) return "var(--primary)";
		if (value >= 3.0) return "var(--warning)";
		return "var(--danger)";
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
	const reportRef = useRef<HTMLDivElement>(null);
	const [reportData, setReportData] = useState<ReportData | null>(null);
	const [loading, setLoading] = useState(true);
	const [graficoData, setGraficoData] = useState<Assunto[] | null>(null);
	const [graficoDataPorcentagem, setGraficoDataPorcentagem] = useState<Assunto[] | null>(null);
	const width = useWindowWidth();
	const meses = [
		{ key: 1, value: "Janeiro" },
		{ key: 2, value: "Fevereiro" },
		{ key: 3, value: "Março" },
		{ key: 4, value: "Abril" },
		{ key: 5, value: "Maio" },
		{ key: 6, value: "Junho" },
		{ key: 7, value: "Julho" },
		{ key: 8, value: "Agosto" },
		{ key: 9, value: "Setembro" },
		{ key: 10, value: "Outubro" },
		{ key: 11, value: "Novembro" },
		{ key: 12, value: "Dezembro" },
	];
	const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);

	const fetchReportData = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`${api}relatorios/geral?mes=${mesSelecionado}`
			);
			const data: ReportResponse = await response.json();
			setReportData(data.data);
		} catch (error) {
			console.error("Erro ao carregar relatório:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchGraficoData = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`${api}geral/grafico?mes=${mesSelecionado}`
			);
			const data: ResponseAssuntos = await response.json();
			const result = []
			const result2 = []
			result.push(data.data['Liderança'])
			result.push(data.data['Comunicação'])
			result.push(data.data['Tomada de Decisão e Resolução'])
			result.push(data.data['Trabalho em Equipe'])
			result.push(data.data['Adaptação a Mudanças'])
			result2.push(data.data['Liderança%'])
			result2.push(data.data['Comunicação%'])
			result2.push(data.data['Tomada de Decisão e Resolução%'])
			result2.push(data.data['Trabalho em Equipe%'])
			result2.push(data.data['Adaptação a Mudanças%'])

			setGraficoData(result);
			setGraficoDataPorcentagem(result2);

		} catch (error) {
			console.error("Erro ao carregar gráfico:", error);
		} finally {
			setLoading(false);
		}
	}

	const handleGeneratePDF = () => {
		console.log('Generating PDF...');
		if (reportRef.current) {
			const element = reportRef.current;
			const opt = {
				margin: 1,
				filename: `relatorio_geral_${mesSelecionado}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2 },
				jsPDF: { unit: 'in', format: 'a2', orientation: 'landscape' }
			};

			html2pdf().set(opt).from(element).save();
		}
	};

	useEffect(() => {
		fetchReportData();
		fetchGraficoData();
	}, [mesSelecionado]);

	if (loading) {
		return <div className="loading">Carregando relatório...</div>;
	}

	if (!reportData) {
		return <div className="error">Erro ao carregar relatório</div>;
	}

	return (
		<div className="reports-container" ref={reportRef}>
			<div className="reports-header">
				<h1>Relatório Geral de Avaliações</h1>
				<div className="reports-filters">
					<select
						className="period-select"
						onChange={async (e) => {
							setMesSelecionado(e.target.value);
						}}
					>
						<option value="">Selecione um mês</option>
						{meses.map((mes) => (
							<option key={mes.key} value={mes.value}>
								{mes.value}
							</option>
						))}
					</select>
				</div>
				<div className="report-actions">
					<button onClick={handleGeneratePDF} className="btn-pdf">
						Gerar PDF
					</button>
				</div>
			</div>

			<div className="overview-section">
				<div className="overview-card">
					{/* <h2>Média Geral: {mesSelecionado}</h2>
          <div className="overview-value">
            {reportData.media_geral.toFixed(1)}
          </div>
          <div className="overview-subtitle">
            Total de Avaliações: {reportData.total_avaliacoes}

          </div> */}
					<h1>{mesSelecionado ? mesSelecionado : 'Nenhum mês selecionado'}</h1>
					<h3>Quantidade de Notas por assuntos!</h3>
					{graficoData && (
						<TableComponent data={graficoData} />
					)}
				</div>
			</div>
			<h3>Quantidade de Notas por assuntos</h3>
			{graficoData && (
				<BarChartComponent data={graficoData} legend={false} width={width * 0.63} />
			)}
			<h3>Porcentagem de Notas por assuntos</h3>
			{graficoDataPorcentagem && (
				<BarChartComponent data={graficoDataPorcentagem} legend={true} width={width * 0.63} />
			)}
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
						<SubjectCard key={subject} subject={subject} media={data.media} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Reports;
