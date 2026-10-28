
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Inicio from './pages/inicio/index'
import CriarConta from './pages/criarconta/index';
import ComoFunciona from './pages/comofunciona/index';
import Doacoes from './pages/doacoes/index';
import Instituicoes from './pages/instituicoes/index';
import CadastroInstituicao from './pages/contaong/index';
import Estabelecimento from './pages/contaestabele/index';
import QueroDoar from './pages/querodoar';
import Dashboard from './pages/dashestabelecimento';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Criar" element={<CriarConta />} />
        <Route path="/ComoFunciona" element={<ComoFunciona />} />
        <Route path="/Doacoes" element={<Doacoes />} />
        <Route path="/Instituicoes" element={<Instituicoes />} />
        <Route path="/CadastroInstituicao" element={<CadastroInstituicao />} />
        <Route path="/Estabelecimento" element={<Estabelecimento />}/>
        <Route path='/QueroDoar' element={<QueroDoar />} />
        <Route path='/DashEstabelecimento' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);