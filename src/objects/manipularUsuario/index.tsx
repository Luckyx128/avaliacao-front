import { use, useState } from 'react'
import ColaboradorSearch from '../colaboradorSearch'
import { useCookies } from 'react-cookie'
import './style.css'
import api from '../../services/api'
import Swal from 'sweetalert2'
type usuarioProps = {
  setores: Data[]
}


type Data = {
  id: number
  nome: string
}

const ManipularUsuario = ({ setores }: usuarioProps) => {
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedUserName, setSelectedUserName] = useState('Nenhum colaborador selecionado')
  const [cookie] = useCookies(['matricula'])
  const [selectedSetor,setSelectedSetor] = useState('')
  const handlerSubmit = async ()=> {
    try{
      // ${api}manipulate/user
      const response = await fetch(`${api}manipulate/user`,
        {
          method:'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({matricula:selectedUser,setor:selectedSetor}),
        }
        
      )
      const result = await response.json();
      switch (result.status_code) {
        case 200:
          Swal.fire({
                      title: "Sucesso!",
                      text: "Usuario atualizado!",
                      icon: "success",
                      confirmButtonColor: "#3085d6",
                    });
                    setSelectedSetor('')
                    setSelectedUserName('Nenhum colaborador selecionado')
                    setSelectedUser('')
                    break
                    
        case 500:
           Swal.fire({
                      title: "Erro!",
                      text: "Erro ao manipular usuario!",
                      icon: "error",
                      confirmButtonColor: "#3085d6",
                    });
          break
                  }
    }catch(error){
      Swal.fire({
                  title: "Erro!",
                  text: "Erro ao manipular usuario!",
                  icon: "error",
                  confirmButtonColor: "#3085d6",
                });
                
    }
  } 
  return (
    <section className="split-card-section">
      <h2>Cadastro de parametro de avaliação</h2>

      <section id="usuario-body">
        <ColaboradorSearch onSelect={(novaMatricula) => {
          setSelectedUser(novaMatricula)
        }}
          onSelectNome={(novoNome) => {
            setSelectedUserName(novoNome)
          }}
          currentMatricula={cookie.matricula}
          searchType='gerenciamento' />
        <div className='section-div'>
          <select  name="user" className="select-options-user">
            <option value={selectedUser}> {selectedUserName}</option>

          </select>
          <select value={selectedSetor} onChange={(e) => {setSelectedSetor(e.target.value)}} name="setor" className="select-options-user">
            <option value="">Selecione um setor</option>
            {setores.map((setor) => (
              <option key={setor.id} value={setor.id}>
                {setor.nome}
              </option>
            ))}
          </select>


        </div>
      </section>
      <button onClick={handlerSubmit} className="btn-primary">
          Cadastrar / Atualizar
        </button>
    </section>
  )
}

export default ManipularUsuario;