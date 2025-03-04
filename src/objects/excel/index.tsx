import * as XLSX from "xlsx";
import "./style.css";
interface ExcelProps {
  avaliados: [
    {
      ano: string;
      id: number;
      matricula: string;
      mes: string;
      negativos: string;
      positivos: string;
      respostas: {
        "Comprometimento com metas e prazos": {
          comentar: string;
          nota: number;
        };
        "Capacidade de liderança e gestão de equipes": {
          comentar: string;
          nota: number;
        };
        "Comunicação clara e objetiva": { comentar: string; nota: number };
        "Resolução de problemas e tomada de decisões": {
          comentar: string;
          nota: number;
        };
        "Trabalho em equipe e colaboração": {
          comentar: string;
          nota: number;
        };
        "Relacionamento interpessoal": { comentar: string; nota: number };
        "Capacidade de adaptação e mudança": {
          comentar: string;
          nota: number;
        };
        "Iniciativa e proatividade": { comentar: string; nota: number };
        "Alcance de metas e produtividade da equipe": {
          comentar: string;
          nota: number;
        };
        "Gestão eficiente do time e delegação de tarefas": {
          comentar: string;
          nota: number;
        };
        "Capacidade de solucionar conflitos internos": {
          comentar: string;
          nota: number;
        };
        "Organização e planejamento estratégico": {
          comentar: string;
          nota: number;
        };
        "Capacidade de inovação e melhorias nos processos": {
          comentar: string;
          nota: number;
        };
      };
    },
  ];
}

const ExportExcelFromAPI = (props: ExcelProps) => {
  const exportToExcel = () => {
    props.avaliados.forEach((av) => {
      if (typeof av.respostas === "string") {
        av.respostas = JSON.parse(av.respostas.replace(/'/g, '"'));
      }
    });

    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Matricula",
        "Mes",
        "Comprometimento com metas e prazos",
        "Capacidade de liderança e gestão de equipes",
        "Capacidade de inovação e melhorias nos processos",
        "Comunicação clara e objetiva",
        "Resolução de problemas e tomada de decisões",
        "Trabalho em equipe e colaboração",
        "Relacionamento interpessoal",
        "Capacidade de adaptação e mudança",
        "Iniciativa e proatividade",
        "Alcance de metas e produtividade da equipe",
        "Gestão eficiente do time e delegação de tarefas",
        "Capacidade de solucionar conflitos internos",
        "Organização e planejamento estratégico",
        "Positivos",
        "Melhorar",
      ], // Cabeçalhos
      ...props.avaliados.map((item) => [
        item.matricula,
        item.mes,

        item.respostas["Comprometimento com metas e prazos"].nota,
        item.respostas["Capacidade de liderança e gestão de equipes"].nota,
        item.respostas["Capacidade de inovação e melhorias nos processos"].nota,
        item.respostas["Comunicação clara e objetiva"].nota,
        item.respostas["Resolução de problemas e tomada de decisões"].nota,
        item.respostas["Trabalho em equipe e colaboração"].nota,
        item.respostas["Relacionamento interpessoal"].nota,
        item.respostas["Capacidade de adaptação e mudança"].nota,
        item.respostas["Iniciativa e proatividade"].nota,
        item.respostas["Alcance de metas e produtividade da equipe"].nota,
        item.respostas["Gestão eficiente do time e delegação de tarefas"].nota,
        item.respostas["Capacidade de solucionar conflitos internos"].nota,
        item.respostas["Organização e planejamento estratégico"].nota,
        item.positivos,
        item.negativos,
      ]),
    ]);

    // Estilizar colunas
    worksheet["!cols"] = [
      { wch: 10 }, // Largura coluna ID
      { wch: 20 }, // Largura coluna Nome
      { wch: 30 }, // Largura coluna Email
    ];

    // Criar workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Avaliação");

    // Gerar arquivo
    XLSX.writeFile(workbook, "Avaliacao.xlsx");
  };

  return (
    <div>
      <button id="exportButton" onClick={exportToExcel}>
        Exportar para Excel
      </button>
    </div>
  );
};

export default ExportExcelFromAPI;
