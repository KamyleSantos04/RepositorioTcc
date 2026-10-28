import './index.scss';

export default function Dashboard() {
  return (
    <div className="pai">


<div className='menu'> 

       
          <img src='./assets/images/image.png' alt='' className='alimento'/> 
       

        <div className='icones'>  
            
            <div className="item-menu">
    <img src="./assets/icons/casa.png" alt="" className="casa" />
    <h1>Início</h1>
  </div>



  <div className="item-menu">
    <img src="./assets/icons/cesta.png" alt="" className="cesta" />
    <h1>Minhas doações</h1>
  </div>

  <div className="item-menu">
    <img src="./assets/icons/doar.png" alt="" className="doar" />
    <h1>Solicitações</h1>
  </div>

  <div className="item-menu">
    <img src="./assets/icons/historico.png" alt="" className="historico" />
    <h1>Histórico</h1>
  </div>

  <div className="item-menu">
    <img src="./assets/icons/estabelecimento.png" alt="" className="estabelecimento" />
    <h1>Meus estabelecimentos</h1>
  </div>

  <div className="item-menu">
    <img src="./assets/icons/conf.png" alt="" className="conf" />
    <h1>Configuração</h1>
  </div>
  <div className="item-menu-sair">
    <img src="./assets/icons/sair.png" alt="" className="sair" />
    <h1>sair</h1>
  </div>
</div> 
      
    </div>

  <div className="ola">

    <div className='titulo'><h1>Olá, Padadaria Pão Bom! 👏</h1><br />
    <p>Aqui esta um resuma das suas atividades</p></div>




  <div className="tabela">
  <div className="cubo doacoes">
    <h2>12</h2>
    <p>Doações ativas</p>
  </div>

  <div className="cubo solicitacoes">
    <h2>8</h2>
    <p>Solicitações recebidas</p>
  </div>

  <div className="cubo concluidas">
    <h2>27</h2>
    <p>Doações concluídas</p>
  </div>

  <div className="cubo alimentos">
    <h2>438 kg</h2>
    <p>Alimentos destinados</p>
  </div>
</div>




<div className="tabeladois">

  <div className="doacoes-recentes">
    <div className="cabecalho-doacoes">
      <h2>Doações recentes</h2>
      <a href="/doacoes">Ver todas</a>
    </div>

    <div className="lista-doacoes">
      <div className="item-doacao">
        

<div className="item-doacao">
  <img className="imagem-doacao" src="/assets/images/images.jpg" alt="Pães franceses" />


        <div className="info-doacao">
          <h3>Pães franceses</h3>
          <p>30 unidades · Retirada até 16:30</p>
        </div>

        <span className="status ativa">Ativa</span>
      </div>
</div>
      <div className="item-doacao">
        <img src="/assets/images/frtvrds.jpg" alt="Frutas variadas" />

        <div className="info-doacao">
          <h3>Frutas variadas</h3>
          <p>15 kg · Retirada até 16:00</p>
        </div>

        <span className="status solicitada">Solicitada</span>
      </div>

      <div className="item-doacao">
        <img src="/assets/images/cmdprt.jpg" alt="Refeições prontas" />

        <div className="info-doacao">
          <h3>Refeições prontas</h3>
          <p>50 unidades · Retirada até 12:00</p>
        </div>

        <span className="status confirmada">Confirmada</span>
      </div>
    </div>
  </div>

  <div className="seu-impacto">
    <h2>Seu impacto</h2>

    <div className="grafico-impacto">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>

    <h3>72%</h3>

    <p>
      dos seus excedentes<br />
      foram destinados.
    </p>

    <a href="/historico">Ver relatório completo</a>
  </div>
</div>
      </div>
     
        
</div>
      
    
  );
}

