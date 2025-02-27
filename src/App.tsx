import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/dashboard';
import Inicio from './components/inicio';
import {CookiesProvider} from 'react-cookie';
function App() {
  console.log(location.href);
  return (
    <BrowserRouter basename='/playground4'>
    <CookiesProvider>
      <Routes>

        <Route path="/" element={<Inicio/>} />
        <Route path="/dashboard" element={<Dashboard /> } />
      </Routes>
      {/* <Inicio /> */}
    </CookiesProvider>
    </BrowserRouter>
  )
}

export default App
