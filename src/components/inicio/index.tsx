import { useState } from "react";
import { InputInicio } from "../../objects/inputs";
import {useCookies} from 'react-cookie';
import './style.css';

function Inicio() {
    const [cookies, setCookie] = useCookies(['nome', 'cargo', 'login', 'matricula', 'super', 'gestor']);
  const [logar, setLogar] = useState(true);

  const api = 'http://172.32.1.81/playground1/api/';

  // @ts-expect-error event is no type
    const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    fetch(`${api}login?username=${data.username}&password=${data.password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {

      if(data.status_code === 200){
          console.log(cookies);
          setCookie('nome', data.data.nome, { path: '/' , 'maxAge': 100000});
          setCookie('cargo', data.data.cargo, { path: '/' , 'maxAge': 100000});
          setCookie('login', data.data.login, { path: '/' , 'maxAge': 100000});
          setCookie('matricula', data.data.matricula, { path: '/' , 'maxAge': 100000});
          setCookie('super', data.data.super, { path: '/' , 'maxAge': 100000});
          setCookie('gestor', data.data.gestor, { path: '/' , 'maxAge': 100000});
            window.location.href = '/playground4/dashboard';
      }else{
        console.log('Login failed');
      }

    })
    .catch(error => console.error(error));

  };

  if (logar) {
    return (
      <div>
        <form onSubmit={submitHandler} id="login-form" method="post">
            <h1>Auto Avaliação</h1>
            <InputInicio placeholder="Matricula plansul"   id="matricula-plansul" name="username" type="text" label="Matrícula Plansul:"/>
            <InputInicio placeholder="Senha" id="senha" name="password" type="password" label="Senha:"/>
            <small onClick={() => setLogar(false)}>Esqueceu sua senha?</small>
          <button className={'btn_inicio'} type="submit">Enviar</button>
        </form>
      </div>
    );
  }else{
    return (
      <div>
        <form onSubmit={submitHandler} id="register-form" method="post">
            <InputInicio  placeholder="Matricula plansul" id="matricula-plansul" name="username" type="text" label="Matrícula Plansul:"/>
            <InputInicio  placeholder="CPF" id="cpf-plansul" name="cpf" type="text" label="CPF:"/>
            <InputInicio  placeholder="Senha" id="senha" name="password" type="password" label="Senha:"/>
            <small onClick={() => setLogar(true)}>Já possui conta?</small>
          <button className={'btn_inicio'} type="submit">Cadastrar</button>
        </form>
      </div>
    );
  }

}

export default Inicio;
