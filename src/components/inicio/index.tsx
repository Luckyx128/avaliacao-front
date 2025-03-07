import { useState } from "react";
import { InputInicio } from "../../objects/inputs";
import { useCookies } from "react-cookie";
import "./style.css";

interface LoginResponse {
  status_code: number;
  data: {
    nome: string;
    cargo: string;
    login: string;
    matricula: string;
    super: boolean;
    gestor: boolean;
  };
}

interface FormData {
  username: string;
  password: string;
  cpf?: string;
}

function Inicio() {
  const [, setCookie] = useCookies([
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
  const [isLoading, setIsLoading] = useState(false);
  const api = import.meta.env.VITE_HOST_API;

  const setCookies = (data: LoginResponse["data"]) => {
    const cookieOptions = { path: "/", maxAge: 3600 }; // 1 hour expiration
    setCookie("nome", data.nome, cookieOptions);
    setCookie("cargo", data.cargo, cookieOptions);
    setCookie("login", data.login, cookieOptions);
    setCookie("matricula", data.matricula, cookieOptions);
    setCookie("super", data.super, cookieOptions);
    setCookie("gestor", data.gestor, cookieOptions);
  };

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErroReset("");

    try {
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData) as Record<string, string>;
      const data: FormData = {
        username: formValues.username,
        password: formValues.password,
        cpf: formValues.cpf,
      };
      
      const response = await fetch(`${api}reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.status_code === 200) {
        setLogar(true);
      } else {
        setErroReset("Erro ao resetar senha. Verifique suas credenciais.");
      }
    } catch (error) {
      setErroReset("Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErro("");

    try {
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData) as Record<string, string>;
      const data: FormData = {
        username: formValues.username,
        password: formValues.password,
      };
      
      const response = await fetch(`${api}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json() as LoginResponse;
      
      if (result.status_code === 200) {
        setCookies(result.data);
        window.location.href = "/dashboard";
      } else {
        setErro("Matrícula ou senha incorreta");
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const LoginForm = () => (
    <form onSubmit={handleLogin} id="login-form" method="post">
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
      <button className="btn_inicio" type="submit" disabled={isLoading}>
        {isLoading ? "Carregando..." : "Enviar"}
      </button>
      {erro && <p className="error">{erro}</p>}
    </form>
  );

  const ResetForm = () => (
    <form onSubmit={handleReset} id="register-form" method="post">
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
      <button className="btn_inicio" type="submit" disabled={isLoading}>
        {isLoading ? "Carregando..." : "Cadastrar"}
      </button>
      {erroReset && <p className="error">{erroReset}</p>}
    </form>
  );

  return (
    <div className="inicio-container">
      {logar ? <LoginForm /> : <ResetForm />}
    </div>
  );
}

export default Inicio;
