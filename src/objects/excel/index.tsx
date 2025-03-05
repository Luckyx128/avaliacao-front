import * as XLSX from "xlsx";
import "./style.css";
import { PiMicrosoftExcelLogo } from "react-icons/pi";

interface ExcelProps {
  avaliados: {
    ano: string;
    id: number;
    matricula: string;
    nome: string;
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
  }[];
  nome: string;
}

const ExportExcelFromAPI = (props: ExcelProps) => {
  const exportToExcel = () => {
    props.avaliados.forEach((av) => {
      if (typeof av.respostas === "string") {
        let resposta: string = av.respostas;
        av.respostas = JSON.parse(resposta.replace(/'/g, '"'));
      }
    });

    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Matricula",
        "Nome",
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
        item.nome,
        item.mes,

        item.respostas["Comprometimento com metas e prazos"].nota +
          " - " +
          item.respostas["Comprometimento com metas e prazos"].comentar,
        item.respostas["Capacidade de liderança e gestão de equipes"].nota +
          " - " +
          item.respostas["Capacidade de liderança e gestão de equipes"]
            .comentar,
        item.respostas["Capacidade de inovação e melhorias nos processos"]
          .nota +
          " - " +
          item.respostas["Capacidade de inovação e melhorias nos processos"]
            .comentar,
        item.respostas["Comunicação clara e objetiva"].nota +
          " - " +
          item.respostas["Comunicação clara e objetiva"].comentar,
        item.respostas["Resolução de problemas e tomada de decisões"].nota +
          " - " +
          item.respostas["Resolução de problemas e tomada de decisões"]
            .comentar,
        item.respostas["Trabalho em equipe e colaboração"].nota +
          " - " +
          item.respostas["Trabalho em equipe e colaboração"].comentar,
        item.respostas["Relacionamento interpessoal"].nota +
          " - " +
          item.respostas["Relacionamento interpessoal"].comentar,
        item.respostas["Capacidade de adaptação e mudança"].nota +
          " - " +
          item.respostas["Capacidade de adaptação e mudança"].comentar,
        item.respostas["Iniciativa e proatividade"].nota +
          " - " +
          item.respostas["Iniciativa e proatividade"].comentar,
        item.respostas["Alcance de metas e produtividade da equipe"].nota +
          " - " +
          item.respostas["Alcance de metas e produtividade da equipe"].comentar,
        item.respostas["Gestão eficiente do time e delegação de tarefas"].nota +
          " - " +
          item.respostas["Gestão eficiente do time e delegação de tarefas"]
            .comentar,
        item.respostas["Capacidade de solucionar conflitos internos"].nota +
          " - " +
          item.respostas["Capacidade de solucionar conflitos internos"]
            .comentar,
        item.respostas["Organização e planejamento estratégico"].nota +
          " - " +
          item.respostas["Organização e planejamento estratégico"].comentar,
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
    XLSX.writeFile(workbook, `Avaliacao_${props.nome}.xlsx`);
  };

  return (
    <div>
      <button id="exportButton" onClick={exportToExcel}>
        Exportar para Excel
      </button>
    </div>
  );
};

interface Props {
  login: string;
  nome: string;
  setListaAvaliacoes: (value: OperadorType[]) => void;
  setNomeAlvo: (value: string) => void;
  setModalVisible: (value: boolean) => void;
}

const ExcelOperador = (props: Props) => {
  const exportToExcel = async () => {
    const api = import.meta.env.VITE_HOST_API;
    fetch(`${api}consultar_operadores?login=${props.login}`)
      .then((response) => response.json())
      .then((data: OperadorType[]) => {
        data.forEach((av) => {
          if (typeof av.respostas === "string") {
            let resposta: string = av.respostas;
            av.respostas = JSON.parse(resposta.replace(/'/g, '"'));
          }

          props.setNomeAlvo(props.nome);
          props.setListaAvaliacoes(data);
          props.setModalVisible(true);
        });
      });
  };

  return (
    <div>
      <PiMicrosoftExcelLogo id="exportButton" onClick={exportToExcel} />
    </div>
  );
};

interface ExcelPreviewProps {
  lista_avaliacoes: OperadorType[];
  nome: string;
}

const ExcelPreview = (props: ExcelPreviewProps) => {
  const exportToExcel = async () => {
    // Criar worksheet

    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Matricula",
        "Mes",
        "Nome",
        "Clareza na comunicação e orientação da equipe",
        "Disponibilidade para ouvir e dar suporte",
        "Respeito e postura profissional",
        "Capacidade de motivar e engajar a equipe",
      ], // Cabeçalhos
      ...props.lista_avaliacoes.map((item) => [
        item.matricula,
        item.mes,
        item.nome,
        item.respostas["Clareza na comunicação e orientação da equipe"].nota +
          " - " +
          item.respostas["Clareza na comunicação e orientação da equipe"]
            .comentar,
        item.respostas["Disponibilidade para ouvir e dar suporte"].nota +
          " - " +
          item.respostas["Disponibilidade para ouvir e dar suporte"].comentar,
        item.respostas["Respeito e postura profissional"].nota +
          " - " +
          item.respostas["Respeito e postura profissional"].comentar,
        item.respostas["Capacidade de motivar e engajar a equipe"].nota +
          " - " +
          item.respostas["Capacidade de motivar e engajar a equipe"].comentar,
      ]),
    ]);
    // // Estilizar colunas
    worksheet["!cols"] = [
      { wch: 10 }, // Largura coluna ID
      { wch: 20 }, // Largura coluna Nome
      { wch: 30 }, // Largura coluna Email
    ];

    // // Criar workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Avaliação");

    // // Gerar arquivo
    XLSX.writeFile(workbook, `Avaliacao_operadores_${props.nome}.xlsx`);
  };
  return (
    <div>
      <PiMicrosoftExcelLogo
        id="exportButton"
        className="export"
        onClick={exportToExcel}
      />
      <table className="excel-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Matricula</th>
            <th>Mes</th>
            <th>Clareza na comunicação e orientação da equipe</th>
            <th>Disponibilidade para ouvir e dar suporte</th>
            <th>Respeito e postura profissional</th>
            <th>Capacidade de motivar e engajar a equipe</th>
          </tr>
        </thead>
        <tbody>
          {props.lista_avaliacoes.map((item) => (
            <tr key={item.matricula}>
              <td>{item.nome}</td>
              <td>{item.matricula}</td>
              <td>{item.mes}</td>
              <td>
                {
                  item.respostas[
                    "Clareza na comunicação e orientação da equipe"
                  ].nota
                }{" "}
                -{" "}
                {
                  item.respostas[
                    "Clareza na comunicação e orientação da equipe"
                  ].comentar
                }
              </td>
              <td>
                {
                  item.respostas["Disponibilidade para ouvir e dar suporte"]
                    .nota
                }{" "}
                -{" "}
                {
                  item.respostas["Disponibilidade para ouvir e dar suporte"]
                    .comentar
                }
              </td>
              <td>
                {item.respostas["Respeito e postura profissional"].nota} -{" "}
                {item.respostas["Respeito e postura profissional"].comentar}
              </td>
              <td>
                {item.respostas["Capacidade de motivar e engajar a equipe"]
                  .nota +
                  " - " +
                  item.respostas["Capacidade de motivar e engajar a equipe"]
                    .comentar}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ExcelOperador, ExportExcelFromAPI, ExcelPreview };

export type OperadorType = {
  ano: string;
  id: number;
  matricula: string;
  nome: string;
  mes: string;
  negativos: string;
  positivos: string;
  respostas: {
    "Clareza na comunicação e orientação da equipe": {
      comentar: string;
      nota: number;
    };
    "Disponibilidade para ouvir e dar suporte": {
      comentar: string;
      nota: number;
    };
    "Respeito e postura profissional": {
      comentar: string;
      nota: number;
    };
    "Capacidade de motivar e engajar a equipe": {
      comentar: string;
      nota: number;
    };
  };
};
