import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard";
import Inicio from "./components/inicio";
import { CookiesProvider } from "react-cookie";
import Gerenciamento from './components/Gerenciamento'
function App() {
  return (
    <BrowserRouter  basename="/playground4">
      <CookiesProvider>

				<Routes>
					<Route path="/" element={<Inicio />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/gerenciamento" element={<Gerenciamento />} />
				</Routes>
			</CookiesProvider>
		</BrowserRouter>
	);
}

export default App;
