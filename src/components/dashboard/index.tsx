import { useEffect, useState } from 'react';
import Modal from '../../objects/modal';
import Staff from '../staff';
import './style.css'
import Operador from "../operador";
import {useCookies} from 'react-cookie';

function Dashboard() {
    const [cookies] = useCookies(['nome', 'cargo', 'login', 'matricula', 'super', 'gestor']);
    const [logado] = useState({nome:cookies.nome,matricula: cookies.matricula,  login: cookies.login,cargo: cookies.cargo, super: cookies.super, gestor: cookies.gestor});
  const [subordinados, setSubordinados] = useState([{'avaliacao':false, 'nome':'', 'matricula':0}]);
  const [modal_avaliacao, setModalAvaliacao] = useState(false);
  const [nomeAlvo, setNomeAlvo] = useState('');
  const [matriculaAlvo, setMatriculaAlvo] = useState(0);
  const [mes, setMes] = useState('');
  // const [ano, setAno] = useState('');
  const [avaliacoes, setAvaliacoes] = useState({'media_das_notas':0.0,'notas_media_por_questao':{"Alcance de metas e produtividade da equipe": 0,
      "Capacidade de adaptação e mudança": 0,
      "Capacidade de inovação e melhorias nos processos": 0,
      "Capacidade de liderança e gestão de equipes": 0,
      "Capacidade de solucionar conflitos internos": 0,
      "Comprometimento com metas e prazos": 0,
      "Comunicação clara e objetiva": 0,
      "Gestão eficiente do time e delegação de tarefas": 0,
      "Iniciativa e proatividade": 0,
      "Organização e planejamento estratégico": 0,
      "Relacionamento interpessoal": 0,
      "Resolução de problemas e tomada de decisões": 0,
      "Trabalho em equipe e colaboração": 0
}});

    if(!cookies.nome){
        window.location.href = '/';
    }
  const api = 'http://127.0.0.1:5000/api/';
  useEffect(() => {
    fetch(`${api}subordinates?cargo=${logado.cargo}&login=${logado.login}&matricula=${logado.matricula}`)
      .then(response => response.json())
      .then(data =>{
        setSubordinados(data.data);
        setMes(data.mes);
        // setAno(data.ano);
      });
      fetch(`${api}avaliacoes?cargo=${logado.cargo}&login=${logado.login}&matricula=${logado.matricula}`)
      .then(response => response.json())
      .then(data =>{

        setAvaliacoes(data.data);
      });
  }, []);


  return (
    <div>
      <h1>Bem-vindo! {logado.nome}</h1>
      <h1>{mes}</h1>
      <h1>Pendentes: {subordinados.length}</h1>


        <main>
            {logado.cargo != '14936' && logado.cargo != '1066' ?


            <div>
                <h5>Nota media geral:  {avaliacoes.media_das_notas}</h5>
          <h5>Alcance de metas e produtividade da equipe {avaliacoes.notas_media_por_questao['Alcance de metas e produtividade da equipe']}</h5>
          <h5>Capacidade de adaptação e mudança {avaliacoes.notas_media_por_questao['Capacidade de adaptação e mudança']}</h5>
          <h5>Capacidade de inovação e melhorias nos processos {avaliacoes.notas_media_por_questao['Capacidade de inovação e melhorias nos processos']}</h5>
          <h5>Capacidade de liderança e gestão de equipes {avaliacoes.notas_media_por_questao['Capacidade de liderança e gestão de equipes']}</h5>
          <h5>Capacidade de solucionar conflitos internos {avaliacoes.notas_media_por_questao['Capacidade de solucionar conflitos internos']}</h5>
          <h5>Comprometimento com metas e prazos {avaliacoes.notas_media_por_questao['Comprometimento com metas e prazos']}</h5>
          <h5>Comunicação clara e objetiva {avaliacoes.notas_media_por_questao['Comunicação clara e objetiva']}</h5>
          <h5>Gestão eficiente do time e delegação de tarefas {avaliacoes.notas_media_por_questao['Gestão eficiente do time e delegação de tarefas']}</h5>
          <h5>Iniciativa e proatividade {avaliacoes.notas_media_por_questao['Iniciativa e proatividade']}</h5>
          <h5>Organização e planejamento estratégico {avaliacoes.notas_media_por_questao['Organização e planejamento estratégico']}</h5>
          <h5>Relacionamento interpessoal {avaliacoes.notas_media_por_questao['Relacionamento interpessoal']}</h5>
          <h5>Resolução de problemas e tomada de decisões {avaliacoes.notas_media_por_questao['Resolução de problemas e tomada de decisões']}</h5>
          <h5>Trabalho em equipe e colaboração {avaliacoes.notas_media_por_questao['Trabalho em equipe e colaboração']}</h5>

      </div>
            :null}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Mes</th>
            <th>Ação/Status</th>
          </tr>
        </thead>
        <tbody>
          {subordinados.map((matricula) => (

            <tr key={matricula.matricula}>
              <td>{matricula.nome}</td>
              <td>Fevereiro</td>
              <td>
              {matricula.avaliacao ? "Avaliado" :
               <button onClick={() => {
                setNomeAlvo(matricula.nome);
                setMatriculaAlvo(matricula.matricula);
                setModalAvaliacao(true)}}
                >Avaliar</button>}

                </td>

            </tr>
          ))}
        </tbody>
      </table>
      </main>
        {logado.cargo != '14936' && logado.cargo != '1066' ?
            <Modal isOpen={modal_avaliacao} onClose={() => setModalAvaliacao(false)} children={<Staff matricula={matriculaAlvo} nome={nomeAlvo} />} />
            :
            <Modal isOpen={modal_avaliacao} onClose={() => setModalAvaliacao(false)} children={<Operador matricula={matriculaAlvo} nome={nomeAlvo} />} />
        }
        </div>
  );
}


export default Dashboard;
