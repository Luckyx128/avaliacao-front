import logo from "../../assets/logo plansul 2.png";
import "./style.css";
import { useCookies } from "react-cookie";
import { IoLogInOutline } from "react-icons/io5";
interface HeaderProps {
  nome: string;
}

const Header = ({ nome }: HeaderProps) => {
  const [cookies] = useCookies([
    "nome",
    "cargo",
    "login",
    "matricula",
    "super",
    "setor_nome",
  ]);
  return (
    <header>
      <img className="logo" src={logo} alt="Logo" />
      <div className="header-info">
        <h2>{nome}</h2>
        <span> - </span>
        <h3>{cookies.setor_nome}</h3>
        <IoLogInOutline
          id="sair"
          size={70}
          onClick={() => {
            cookies.matricula = null;
            cookies.nome = null;
            cookies.cargo = null;
            window.location.href = "/playground4/";
          }}
        />
      </div>
    </header>
  );
};

export default Header;
