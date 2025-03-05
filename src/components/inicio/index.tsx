import { useState } from "react";
import { InputInicio } from "../../objects/inputs";
import { useCookies } from "react-cookie";
import "./style.css";

function Inicio() {
  // @ts-expect-error somente criacao do cookie
  const [cookies, setCookie] = useCookies([
    "nome",
    "cargo",
    "login",
    "matricula",
    "super",
    "gestor",
  ]);
  const [logar, setLogar] = useState(true);
  const [erro, setErro] = useState("");
  const [erroReset, setErroReset] = useState("");
  const api = import.meta.env.VITE_HOST_API;
  // @ts-expect-error event is no type
  const Resete = (event) => {
    event.preventDefault();
    if (event.target instanceof HTMLFormElement) {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData);
      fetch(`${api}reset?username=${data.username}&password=${data.password}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status_code === 200) {
            setLogar(true);
          } else {
            setLogar(false);
          }
        })
        .catch(() => setErroReset("Erro ao Resetar"));
    }
  };

  // @ts-expect-error event is no type
  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    fetch(`${api}login?username=${data.username}&password=${data.password}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200) {
          setCookie("nome", data.data.nome, { path: "/", maxAge: 100000 });
          setCookie("cargo", data.data.cargo, { path: "/", maxAge: 100000 });
          setCookie("login", data.data.login, { path: "/", maxAge: 100000 });
          setCookie("matricula", data.data.matricula, {
            path: "/",
            maxAge: 100000,
          });
          setCookie("super", data.data.super, { path: "/", maxAge: 100000 });
          setCookie("gestor", data.data.gestor, { path: "/", maxAge: 100000 });
          window.location.href = "/dashboard";
        } else {
          setErro("Matricula ou senha incorreta");
        }
      })
      .catch(() => setErro("Erro ao logar"));
  };

  if (logar) {
    return (
      <div>
        <form onSubmit={submitHandler} id="login-form" method="post">
          <h1>Auto Avaliação</h1>
          <InputInicio
            placeholder="Matricula plansul"
            id="matricula-plansul"
            name="username"
            type="text"
            label="Matrícula Plansul:"
          />
          <InputInicio
            placeholder="Senha"
            id="senha"
            name="password"
            type="password"
            label="Senha:"
          />
          <small onClick={() => setLogar(false)}>Esqueceu sua senha?</small>
          <button className={"btn_inicio"} type="submit">
            Enviar
          </button>
          <p>{erro}</p>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <form onSubmit={Resete} id="register-form" method="post">
          <InputInicio
            placeholder="Matricula plansul"
            id="matricula-plansul"
            name="username"
            type="text"
            label="Matrícula Plansul:"
          />
          <InputInicio
            placeholder="CPF"
            id="cpf-plansul"
            name="cpf"
            type="text"
            label="CPF:"
          />
          <InputInicio
            placeholder="Senha"
            id="senha"
            name="password"
            type="password"
            label="Senha:"
          />
          <small onClick={() => setLogar(true)}>Já possui conta?</small>
          <button className={"btn_inicio"} type="submit">
            Cadastrar
          </button>
          <p>{erroReset}</p>
        </form>
      </div>
    );
  }
}

export default Inicio;
