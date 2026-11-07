import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Inicio from './pages/inicio/index';
import CriarConta from './pages/criarconta/index';
import ComoFunciona from './pages/comofunciona/index';
import Doacoes from './pages/doacoes/index';
import Instituicoes from './pages/instituicoes/index';
import CadastroInstituicao from './pages/contaong/index';
import Estabelecimento from './pages/contaestabele/index';
import CadastrarAlimento from './pages/cadastroalimento/index';
import Dashboard from './pages/dashestabelecimento';
import DashboardONG from './pages/dashong/index';
import Entrar from './pages/entrarconta/index';
import MinhasDoacoes from './pages/minhasdoacoes/index';
import Solicitacoes from './pages/solicitacoes/index';
import Historico from './pages/historico/index';
import MeusEstabelecimentos from './pages/meuestabele/index';
import Configuracao from './pages/configuracao/index';

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
        <Route path="/Estabelecimento" element={<Estabelecimento />} />
        <Route path="/CadastrarAlimento" element={<CadastrarAlimento />} />
        <Route path="/DashEstabelecimento" element={<Dashboard />} />
        <Route path="/Entrar" element={<Entrar />} />
        <Route path="/DashONG" element={<DashboardONG />} />
        <Route path="/MinhasDoacoes" element={<MinhasDoacoes />} />
        <Route path="/Solicitacoes" element={<Solicitacoes />} />
        <Route path="/Historico" element={<Historico />} />
        <Route
          path="/MeusEstabelecimentos"
          element={<MeusEstabelecimentos />}
        />
        <Route path="/Configuracao" element={<Configuracao />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);