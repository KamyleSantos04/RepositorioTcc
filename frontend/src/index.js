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
import BuscarDoacoes from './pages/dashong/buscardoacoes';
import SolicitacoesOng from './pages/dashong/solicitacoes';
import Recebimentos from './pages/dashong/recebimentos';
import HistoricoOng from './pages/dashong/historico';
import Entrar from './pages/entrarconta/index';
import MinhasDoacoes from './pages/minhasdoacoes/index';
import Solicitacoes from './pages/solicitacoes/index';
import Historico from './pages/historico/index';
import Perfil from './pages/perfil';
import { TIPO_ESTABELECIMENTO, TIPO_ONG } from './lib/sessao';

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
        <Route path="/DashONG/BuscarDoacoes" element={<BuscarDoacoes />} />
        <Route path="/DashONG/Solicitacoes" element={<SolicitacoesOng />} />
        <Route path="/DashONG/Recebimentos" element={<Recebimentos />} />
        <Route path="/DashONG/Historico" element={<HistoricoOng />} />
        <Route path="/DashONG/Perfil" element={<Perfil tipo={TIPO_ONG} />} />
        <Route path="/MinhasDoacoes" element={<MinhasDoacoes />} />
        <Route path="/Solicitacoes" element={<Solicitacoes />} />
        <Route path="/Historico" element={<Historico />} />
        <Route path="/PerfilEstabelecimento" element={<Perfil tipo={TIPO_ESTABELECIMENTO} />} />
        <Route path="/MeusEstabelecimentos" element={<Perfil tipo={TIPO_ESTABELECIMENTO} />} />
        <Route path="/Configuracao" element={<Perfil tipo={TIPO_ESTABELECIMENTO} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
