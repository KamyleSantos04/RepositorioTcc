
import './index.scss'
import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <div className="principal">
      
      <section className='cima'>
      <img src='./assets/images/logo.png' alt=''></img>
      <Link className='ini' to="/">Início</Link>
      <Link to="/ComoFunciona">Como funciona</Link>
      <Link to="/Doacoes">Doações</Link>
      <Link to="/Instituicoes">Instituições</Link>
      <button className='um'>Entrar</button>
      <Link to='/Criar'><button className='dois'>Criar conta</button></Link>
      </section>  

    <div className="maior">
      <section className='texto'>
     <h1 className='menos'>Menos desperdício. <br/> <span>Mais alimento</span>  <br /> chegando a quem precisa.</h1>

      <p className='conectamos'>Conectamos estabelecimentos que possuem <br />excedentes alimentares  a instituições <br />que precisam deles.</p>
        </section>
      <div className="foto"><img src='./assets/images/bonequinhos.png' alt='' width={400}></img></div>
    
    </div>

      <section className='botoes'>
        <Link to='./QueroDoar'><button className='doar'>Quero doar</button></Link>
        <button className='doardois'>Preciso de alimentos</button>
      </section>

      <div className='bege'>
        <div className="icons">
          <img src='./assets/images/maca.png' alt='' width={150}></img>
          <img src='./assets/images/pessoass.png' alt='' width={150}></img>
          <img src='./assets/images/folha.png' alt='' width={150}></img>
        </div>
        <div className='testu'>
          <p>Conecta estabelecimento e instituições</p>
          <p>Combate a fome e o desperdício</p>
          <p className='sim'>Fortalece as comunidades</p>

         
        </div>
      </div>
    </div>
  );
}


